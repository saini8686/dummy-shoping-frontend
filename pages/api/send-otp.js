export default function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { email } = req.body;
      
      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Just log to console instead of sending email
      console.log(`OTP for ${email}: ${otp}`);
      
      return res.status(200).json({ 
        success: true, 
        message: 'OTP generated successfully. Check console for the OTP.',
        otp // Include OTP in response for development
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to generate OTP' 
      });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}