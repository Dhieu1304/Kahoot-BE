const nodemailer = require('nodemailer');

const sendEmail = (receiver, subject, content) => {
  return new Promise(async (resolve, reject) => {
    try {
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_APP,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      });

      let send = await transporter.sendMail({
        from: '"Kahoot_HCMUS" <none@example.com>',
        to: receiver,
        subject: subject,
        html: content,
      });

      if (send) {
        resolve(send);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports.forgotPassword = (fullName, link) => {
  return `<!DOCTYPE html>
    <html>
    <head>
    <title>EmailVerify</title>
    <style type="text/css" rel="stylesheet" media="all">
        .full-email {
        max-width: 600px;
        width: 80%;
        padding-right: var(--bs-gutter-x, 0.75rem);
        padding-left: var(--bs-gutter-x, 0.75rem);
        margin-right: auto;
        margin-left: auto;
        height: 100vh;
    }

        .title-header {
        height: 20%;
        background: aquamarine;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
    }

        .title-header h1 {
        margin: auto;
        font-family: fantasy;
        font-weight: bold;
    }

        .btn-verify {
        display: flex;
        padding: 15px;
    }

        .btn-verify a{
        font-weight: 600;
        color: white;
        margin: 0 auto;
        padding: 7px;
        background: #3f479b;
        text-decoration: none;
    }

        div {
        margin-top: 5px;
    }

        .link-style {
        margin: 10px 0 10px 0;
        color: #0a53be;
        font-style: italic;
    }

        .footer {
        margin-top: 20px;
    }
    </style>
    </head>

    <body>
    <div class="full-email">
        <div class="title-header">
            <h1>Kahoot_HCMUS</h1>
        </div>
        <div class="">
            Hi ${fullName},
        </div>
        <div>
            <div>
                There was recently a request to change the password on your account. If you requested this password change,
                please click the link below to set a new password:
            </div>
            <div class="btn-verify">
                <a href="${link}" target="_blank"> Click here to change your password </a>
            </div>
            <div>If the button above is not working, paste this link below into your browser:</div>
            <div class="link-style">${link}</div>
            <div>If you don't want to change your password, just ignore this message.</div>
            <div>
                Thank you.
            </div>
            <div>
                -The Kahoot_HCMUS Team
            </div>

            <div class="footer">
                <hr/>
                <div class="">Copyright © Kahoot_HCMUS - Web 2022</div>
            </div>
        </div>
    </div>
    </body>
    </html>`;
};

const verifyEmail = (fullName, role, link) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>EmailVerify</title>
        <style type="text/css" rel="stylesheet" media="all">
            .full-email {
                max-width: 600px;
                width: 80%;
                padding-right: var(--bs-gutter-x, 0.75rem);
                padding-left: var(--bs-gutter-x, 0.75rem);
                margin-right: auto;
                margin-left: auto;
                height: 100vh;
            }
            
            .title-header {
                height: 20%;
                background: aquamarine;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 10px;
            }
            
            .title-header h1 {
                margin: auto;
                font-family: fantasy;
                font-weight: bold;
            }
            
            .btn-verify {
                display: flex;
                padding: 15px;
            }
            
            .btn-verify a {
                font-weight: 600;
                color: white;
                margin: 0 auto;
                padding: 7px;
                background: #3f479b;
                text-decoration: none;
            }
            
            div {
                margin-top: 5px;
            }
            
            .link-style {
                margin: 10px 0 10px 0;
                color: #0a53be;
                font-style: italic;
            }
            
            .footer {
                margin-top: 20px;
            }
        </style>
    </head>
    
    <body>
        <div class="full-email">
            <div class="title-header">
                <h1>Kahoot_HCMUS</h1>
            </div>
            <div class="">
                Hi ${fullName},
            </div>
            <div>
                <div>
                    Welcome to Kahoot_HCMUS! From now on, you become a member with the role of ${role}. We send you a password to log in to the system, absolutely do not share this password with anyone.
                </div>
                <div>
                    Please click below button to verify your account before login.
                </div>
                <div class="btn-verify">
                    <a href="${link}" target="_blank"> Click here to Verify </a>
                </div>
                <div>
                    Thank you.
                </div>
                <div>
                    -The Kahoot_HCMUS Team
                </div>
                <div class="footer">
                    <hr/>
                    <div class="">Copyright © Kahoot_HCMUS - Web 2022</div>
                </div>
            </div>
        </div>
    </body>
    </html>`;
};

module.exports.sendVerifyEmail = async (email, name, role, token) => {
  try {
    const urlApp = process.env.NODE_ENV === 'PRODUCTION' ? process.env.REACT_URL_APP : `http://localhost:3043`;
    const link = `${urlApp}/auth/verify-email?token=${token}`;
    const content = verifyEmail(name, role, link);
    const result = await sendEmail(email, 'Welcome to Kahoot_HCMUS', content);
    return !!result;
  } catch (e) {
    console.error(e.message);
  }
};
