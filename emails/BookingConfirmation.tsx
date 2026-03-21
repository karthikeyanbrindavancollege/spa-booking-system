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
} from '@react-email/components'
import { formatDisplayDate, formatTime } from '@/lib/utils'

interface BookingConfirmationEmailProps {
  customerName: string
  date: string
  time: string
  bookingId: string
  notes?: string
  address?: string
}

export function BookingConfirmationEmail({
  customerName,
  date,
  time,
  bookingId,
  notes,
  address,
}: BookingConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your appointment is confirmed for {formatDisplayDate(date)} at {formatTime(time)}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Appointment Confirmed! ✅</Heading>
          
          <Text style={text}>
            Hi {customerName},
          </Text>
          
          <Text style={text}>
            Your appointment has been successfully scheduled. Here are the details:
          </Text>

          <Section style={appointmentDetails}>
            <Text style={detailLabel}>📅 Date & Time</Text>
            <Text style={detailValue}>
              {formatDisplayDate(date)} at {formatTime(time)}
            </Text>

            <Text style={detailLabel}>👤 Name</Text>
            <Text style={detailValue}>{customerName}</Text>

            {notes && (
              <>
                <Text style={detailLabel}>📝 Notes</Text>
                <Text style={detailValue}>{notes}</Text>
              </>
            )}

            {address && (
              <>
                <Text style={detailLabel}>📍 Location</Text>
                <Text style={detailValue}>{address}</Text>
              </>
            )}

            <Text style={detailLabel}>🆔 Booking ID</Text>
            <Text style={detailValue}>{bookingId}</Text>
          </Section>

          <Hr style={hr} />

          <Section>
            <Heading style={h2}>What's Next?</Heading>
            <Text style={text}>
              • Please arrive 5 minutes early for your appointment
            </Text>
            <Text style={text}>
              • We'll contact you if any changes are needed
            </Text>
            <Text style={text}>
              • If you need to reschedule, please contact us as soon as possible
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Need to make changes? Reply to this email or contact us directly.
            <br />
            <br />
            Thank you for choosing our services!
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

const appointmentDetails = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
}

const detailLabel = {
  color: '#64748b',
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