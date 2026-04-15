
import { NextResponse } from 'next/server';
import { adminDb, admin } from '@/lib/firebase-admin';

/**
 * API route to process contact form submissions.
 * Creates a document in the 'mail' collection to trigger the 'Trigger Email' extension.
 */
export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const mailDoc = {
      to: 'kramera613@gmail.com',
      replyTo: email,
      message: {
        subject: `פנייה חדשה מאתר חיה ישראל - ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #f0f0f0; border-radius: 20px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #0070f3; font-size: 24px; margin: 0;">פנייה חדשה מאתר חיה ישראל</h1>
            </div>
            <div style="background-color: #f8f9fa; padding: 25px; border-radius: 15px; margin-bottom: 25px;">
              <p style="margin: 0 0 15px 0;"><strong>שם השולח:</strong> ${name}</p>
              <p style="margin: 0 0 15px 0;"><strong>דוא"ל לחזרה:</strong> ${email}</p>
              <p style="margin: 0;"><strong>תוכן ההודעה:</strong></p>
              <div style="margin-top: 10px; padding: 15px; background-color: #ffffff; border-left: 5px solid #0070f3; border-radius: 5px; font-style: italic;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            <div style="text-align: center; color: #999; font-size: 12px;">
              <p>הודעה זו נשלחה באופן אוטומטי ממערכת האתר של חיה ישראל.</p>
            </div>
          </div>
        `,
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      name,
      email,
      source: 'contact-form'
    };

    // Save to Firestore 'mail' collection to trigger the extension
    await adminDb.collection('mail').add(mailDoc);
    
    // Also log in a dedicated 'contacts' collection for backup
    await adminDb.collection('contacts').add({
      name,
      email,
      message,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'SENT'
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
