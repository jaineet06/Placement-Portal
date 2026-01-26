const getSignupTemplate = (name, email, password) => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f2f5; margin: 0; padding: 0; }
    .wrapper { background-color: #f0f2f5; padding: 40px 10px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); }
    
    /* Header Section */
    .header { background-color: #003366; padding: 35px 20px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 2px; }
    .header p { margin: 10px 0 0; font-size: 14px; opacity: 0.9; }

    /* Content Section */
    .content { padding: 40px; color: #333333; line-height: 1.6; }
    .welcome-text { font-size: 18px; color: #003366; font-weight: 600; margin-bottom: 20px; }
    
    /* Status Badge */
    .status-badge { display: inline-block; background-color: #fff3cd; color: #856404; padding: 8px 16px; border-radius: 50px; font-size: 13px; font-weight: bold; margin-bottom: 25px; border: 1px solid #ffeeba; }

    /* Credentials Box */
    .credentials-box { background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 25px; margin: 25px 0; }
    .credential-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .credential-row:last-child { border-bottom: none; }
    .label { font-weight: bold; color: #666; font-size: 14px; }
    .value { font-family: 'Courier New', Courier, monospace; color: #003366; font-weight: bold; font-size: 15px; }

    /* Instructions Section */
    .instructions { font-size: 14px; color: #555; background-color: #f1f8ff; padding: 20px; border-radius: 8px; border-left: 4px solid #003366; }
    .instructions h3 { margin-top: 0; color: #003366; font-size: 15px; }
    
    /* Footer Section */
    .footer { background-color: #f8f9fa; text-align: center; padding: 25px; font-size: 12px; color: #999; border-top: 1px solid #eeeeee; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>Training & Placement Cell</h1>
        <p>Official Registration Notification</p>
      </div>
      
      <div class="content">
        <div class="welcome-text">Hello, ${name}</div>
        
        <div class="status-badge">● PENDING VERIFICATION</div>
        
        <p>Your registration on the <strong>Central Placement Portal</strong> has been recorded. Your account is currently under administrative review.</p>
        
        <p>For your security and record-keeping, please find your access credentials below:</p>
        
        <div class="credentials-box">
          <div class="credential-row">
            <span class="label">Portal ID: </span>
            <span class="value">${email}</span>
          </div>
          <div class="credential-row">
            <span class="label">Password: </span>
            <span class="value">${password}</span>
          </div>
        </div>

        <div class="instructions">
          <h3>Current Phase: Administrative Approval</h3>
          <p style="margin: 0;">Access to profile creation and job applications will be granted once your enrollment details are verified by the department. You will receive a separate notification upon approval.</p>
        </div>
      </div>

      <div class="footer">
        &copy; ${new Date().getFullYear()} Training & Placement Cell. All rights reserved.<br>
        This is a system-generated email. Please keep these credentials confidential.
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

const getVerificationTemplate = (name) => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
    .wrapper { background-color: #f8fafc; padding: 40px 15px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
    .header { background-color: #003366; padding: 40px 20px; text-align: center; color: #ffffff; }
    .content { padding: 40px; color: #334155; text-align: center; }
    .success-badge { display: inline-block; background-color: #dcfce7; color: #166534; padding: 6px 16px; border-radius: 99px; font-size: 12px; font-weight: 700; border: 1px solid #bbf7d0; margin-bottom: 20px; }
    .title { font-size: 24px; color: #0f172a; font-weight: 800; margin-bottom: 16px; }
    .message { color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 32px; }
    .btn { background: linear-gradient(135deg, #003366 0%, #001f3f 100%); color: #ffffff !important; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 15px; display: inline-block; }
    .footer { text-align: center; padding: 30px; font-size: 11px; color: #94a3b8; background-color: #ffffff; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1 style="margin:0; font-size:18px; letter-spacing:2px;">PORTAL VERIFIED</h1>
      </div>
      <div class="content">
        <div class="success-badge">ACCOUNT ACTIVE</div>
        <div class="title">Verification Complete</div>
        <p class="message">Hello ${name}, your student credentials have been approved. You now have full administrative clearance to build your profile and apply for drives.</p>
        
        <a href=${process.env.FRONTEND_URL}/profile class="btn">Complete Student Profile</a>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Training & Placement Cell. <br>
        Please log in to your dashboard to sync your latest data.
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

export { getSignupTemplate, getVerificationTemplate }