const { createInquiry } = require('./apps/storefront/src/lib/queries/inquiries');

async function test() {
  try {
    await createInquiry({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'This is a test message'
    });
    console.log('Inquiry submitted successfully');
  } catch (error) {
    console.error('Error:', error);
  }
}

test();