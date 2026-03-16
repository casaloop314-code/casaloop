import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface PaymentVerificationRequest {
  paymentId: string;
  userId: string;
  amount: number;
  propertyId?: string;
  serviceId?: string;
  reservationId?: string;
  type: 'reservation' | 'service_booking' | 'other';
}

interface PiPaymentDTO {
  identifier: string;
  user_uid: string;
  amount: number;
  memo: string;
  metadata: object;
  from_address: string;
  to_address: string;
  direction: string;
  created_at: string;
  network: string;
  status: {
    developer_approved: boolean;
    transaction_verified: boolean;
    developer_completed: boolean;
    cancelled: boolean;
    user_cancelled: boolean;
  };
  transaction: null | {
    txid: string;
    verified: boolean;
    _link: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentVerificationRequest = await request.json();
    const { paymentId, userId, amount, propertyId, serviceId, reservationId, type } = body;

    console.log('[v0] Payment verification request:', { paymentId, userId, amount, type });

    // Validate required fields
    if (!paymentId || !userId || !amount || !type) {
      return NextResponse.json(
        { error: 'Missing required fields', success: false },
        { status: 400 }
      );
    }

    // Check if payment was already processed (prevent double-processing)
    const paymentLogRef = doc(db, 'paymentLogs', paymentId);
    const existingLog = await getDoc(paymentLogRef);

    if (existingLog.exists()) {
      console.log('[v0] Payment already processed:', paymentId);
      return NextResponse.json(
        { 
          error: 'Payment already processed', 
          success: false,
          duplicate: true 
        },
        { status: 400 }
      );
    }

    // Verify payment with Pi Network API
    const piApiKey = process.env.NEXT_PUBLIC_PI_API_KEY;
    
    if (!piApiKey) {
      console.error('[v0] Pi API key not configured');
      return NextResponse.json(
        { error: 'Server configuration error', success: false },
        { status: 500 }
      );
    }

    // Call Pi Network API to verify payment
    const verifyResponse = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Key ${piApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!verifyResponse.ok) {
      console.error('[v0] Pi API verification failed:', verifyResponse.status);
      return NextResponse.json(
        { error: 'Payment verification failed', success: false },
        { status: 400 }
      );
    }

    const paymentData: PiPaymentDTO = await verifyResponse.json();
    console.log('[v0] Payment data from Pi Network:', paymentData);

    // Validate payment details
    if (paymentData.user_uid !== userId) {
      console.error('[v0] User ID mismatch');
      return NextResponse.json(
        { error: 'User ID mismatch', success: false },
        { status: 400 }
      );
    }

    if (paymentData.amount !== amount) {
      console.error('[v0] Amount mismatch');
      return NextResponse.json(
        { error: 'Amount mismatch', success: false },
        { status: 400 }
      );
    }

    // Check payment status
    if (!paymentData.status.transaction_verified) {
      console.error('[v0] Payment not verified on blockchain');
      return NextResponse.json(
        { error: 'Payment not verified', success: false },
        { status: 400 }
      );
    }

    if (paymentData.status.cancelled || paymentData.status.user_cancelled) {
      console.error('[v0] Payment was cancelled');
      return NextResponse.json(
        { error: 'Payment was cancelled', success: false },
        { status: 400 }
      );
    }

    // Approve the payment on Pi Network
    await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Key ${piApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Complete the payment on Pi Network
    const completeResponse = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Key ${piApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          txid: paymentData.transaction?.txid || paymentId,
        }),
      }
    );

    if (!completeResponse.ok) {
      console.error('[v0] Failed to complete payment');
      return NextResponse.json(
        { error: 'Failed to complete payment', success: false },
        { status: 500 }
      );
    }

    // Log the successful payment
    await setDoc(paymentLogRef, {
      paymentId,
      userId,
      amount,
      type,
      propertyId: propertyId || null,
      serviceId: serviceId || null,
      reservationId: reservationId || null,
      status: 'completed',
      timestamp: Date.now(),
      txid: paymentData.transaction?.txid || null,
      fromAddress: paymentData.from_address,
      toAddress: paymentData.to_address,
      verified: true,
      userAgent: request.headers.get('user-agent') || 'unknown',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
    });

    // Update reservation or booking status
    if (reservationId) {
      const reservationRef = doc(db, 'reservations', reservationId);
      await updateDoc(reservationRef, {
        status: 'confirmed',
        paymentId,
        paidAt: Date.now(),
      });
    }

    console.log('[v0] Payment verified and completed successfully:', paymentId);

    return NextResponse.json({
      success: true,
      paymentId,
      txid: paymentData.transaction?.txid,
      message: 'Payment verified and completed successfully',
    });

  } catch (error) {
    console.error('[v0] Payment verification error:', error);
    return NextResponse.json(
      { 
        error: 'Payment verification failed', 
        success: false,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
