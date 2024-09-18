import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import fs from 'fs';
import path from 'path';
import "dotenv/config";

const logoPath = path.resolve(__dirname, '../assets/GODSPEED.png');
const logoBase64 = fs.readFileSync(logoPath, { encoding: 'base64' });

const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    },
} as SMTPTransport.Options);

interface BookingDetails {
    bookingReference: string;
    passengerName: string;
    departureDate: string;
}

export const sendTicketEmail = async (to: string, pdfBuffer: Buffer, bookingDetails: BookingDetails): Promise<void> => {
    const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.EMAIL,
        to,
        subject: "Your Flight Ticket Confirmation",
        text: `Your flight ticket is attached to this email. Booking reference: ${bookingDetails.bookingReference}`,
        html: `
        <div style="font-family: Arial, sans-serif; text-align: center;">
            <div style="background-color: #f7f7f7; padding: 20px;">
                <img src="data:image/png;base64,${logoBase64}" alt="Volare Flights" style="width: 150px; height: auto;">
            </div>
            <div style="padding: 20px;">
                <h1 style="color: #333;">Your Flight Ticket Confirmation</h1>
                <p style="font-size: 16px; color: #555;">Thank you for choosing Volare Flights. Your flight ticket is attached to this email.</p>
                <p style="font-size: 16px; color: #555;">Booking Reference: <strong>${bookingDetails.bookingReference}</strong></p>
                <p style="font-size: 16px; color: #555;">Date: ${bookingDetails.departureDate}</p>
                <p style="font-size: 16px; color: #555;">Please find your ticket attached to this email. We recommend you keep this for your records.</p>
                <p style="font-size: 16px; color: #555;">We wish you a pleasant flight!</p>
                <p style="font-size: 16px; color: #555;">Best regards,</p>
                <p style="font-size: 16px; color: #555;">The Godspeed Airlines Team</p>
            </div>
            <div style="background-color: #f7f7f7; padding: 20px;">
                <p style="font-size: 14px; color: #999;">&copy; 2024 Godspeed Airlines. All rights reserved.</p>
                <p style="font-size: 14px; color: #999;"><a href="mailto:support@godspeedairlines.com" style="color: #0073e6;">support@godspeedairlines.com</a></p>
            </div>
        </div>
    `,
        attachments: [
            {
                filename: 'flight-ticket.pdf',
                content: pdfBuffer
            }
        ]
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Ticket email sent to ", to);
    } catch (error) {
        console.error("Error sending ticket email", error);
        throw new Error("Failed to send ticket email");
    }
};