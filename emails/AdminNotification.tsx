import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Link,
} from '@react-email/components'
import { formatDisplayDate, formatTime } from '@/lib/utils'

interface AdminNotificationEmailProps {
  customerName: string
  customerContact: string
  date: string
  time: string
  bookingId: string
  notes?: string
  address?: string
}

export function AdminNotificationEmail({
  customerName,
  customerContact,
  date,
  time,
  bookingId,
  notes,
  address,
}: AdminNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New appointment booking from {customerName} for {formatDisplayDate(date)}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>🗓️ New Appointment Booking</Heading>
          
          <Text style={text}>
            You have received a new appointment booking. Here are the details:
          </Text>

          <Section style={bookingDetails}>
            <Text style={detailLabel}>📅 Date & Time</Text>
            <Text style={detailValue}>
              {formatDisplayDate(date)} at {formatTime(time)}
            </Text>

            <Text style={detailLabel}>👤 Customer Information</Text>
            <Text style={detailValue}>
              <strong>Name:</strong> {customerName}<br />
              <strong>Contact:</strong> {customerContact}
            </Text>

            {notes && (
              <>
                <Text style={detailLabel}>📝 Customer Notes</Text>
                <Text style={detailValue}>{notes}</Text>
              </>
            )}

            {address && (
              <>
                <Text style={detailLabel}>📍 Customer Location</Text>
                <Text style={detailValue}>{address}</Text>
              </>
            )}

            <Text style={detailLabel}>🆔 Booking Reference</Text>
            <Text style={detailValue}>{bookingId}</Text>
          </Section>

          <Hr style={hr} />

          <Section>
            <Heading style={h2}>Quick Actions</Heading>
            <Text style={text}>
              • View all bookings in your admin dashboard
            </Text>
            <Text style={text}>
              • Contact the customer if needed: {customerContact}
            </Text>
            <Text style={text}>
              • Cancel or reschedule through the admin panel
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            This is an automated notification from your appointment booking system.
            <br />
            <br />
            Booking ID: {bookingId}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
}

const h2 = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '30px 0 15px',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
}

const bookingDetails = {
  backgroundColor: '#f0f9ff',
  border: '1px solid #bae6fd',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
}

const detailLabel = {
  color: '#0369a1',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '16px 0 4px',
}

const detailValue = {
  color: '#1e293b',
  fontSize: '16px',
  margin: '0 0 16px',
}

const hr = {
  borderColor: '#e2e8f0',
  margin: '20px 0',
}

const footer = {
  color: '#64748b',
  fontSize: '14px',
  lineHeight: '24px',
  textAlign: 'center' as const,
}