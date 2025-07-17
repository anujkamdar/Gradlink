import { sendMail } from "./SendMailUtil.js";

const getWelcomeEmailTemplate = (userRole, userName, collegeName) => {
  const baseStyles = `
    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f8fafc;
    }
    .container {
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }
    .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 40px 30px;
        text-align: center;
    }
    .header h1 {
        margin: 0;
        font-size: 2.5em;
        font-weight: 700;
        letter-spacing: -1px;
    }
    .header p {
        margin: 10px 0 0 0;
        font-size: 1.1em;
        opacity: 0.9;
    }
    .content {
        padding: 40px 30px;
    }
    .welcome-message {
        font-size: 1.2em;
        margin-bottom: 30px;
        color: #4a5568;
    }
    .features {
        display: grid;
        gap: 20px;
        margin: 30px 0;
    }
    .feature {
        display: flex;
        align-items: flex-start;
        padding: 20px;
        background-color: #f7fafc;
        border-radius: 8px;
        border-left: 4px solid #667eea;
    }
    .feature-icon {
        font-size: 24px;
        margin-right: 15px;
        margin-top: 2px;
    }
    .feature-content h3 {
        margin: 0 0 8px 0;
        color: #2d3748;
        font-size: 1.1em;
    }
    .feature-content p {
        margin: 0;
        color: #4a5568;
        font-size: 0.95em;
    }
    .next-steps {
        background-color: #edf2f7;
        padding: 25px;
        border-radius: 8px;
        margin: 30px 0;
    }
    .next-steps h3 {
        margin-top: 0;
        color: #2d3748;
    }
    .steps-list {
        list-style: none;
        padding: 0;
    }
    .steps-list li {
        margin: 10px 0;
        padding-left: 30px;
        position: relative;
    }
    .steps-list li:before {
        content: "✓";
        position: absolute;
        left: 0;
        color: #48bb78;
        font-weight: bold;
        font-size: 1.2em;
    }
    .support-section {
        text-align: center;
        margin: 30px 0;
        padding: 25px;
        background-color: #f7fafc;
        border-radius: 8px;
    }
    .footer {
        background-color: #2d3748;
        color: white;
        padding: 30px;
        text-align: center;
    }
    .footer p {
        margin: 5px 0;
        opacity: 0.8;
    }
    .social-links {
        margin: 15px 0;
    }
    .social-links a {
        color: white;
        text-decoration: none;
        margin: 0 10px;
        font-size: 1.1em;
    }
    @media (max-width: 600px) {
        body {
            padding: 10px;
        }
        .header, .content {
            padding: 20px;
        }
        .header h1 {
            font-size: 2em;
        }
    }
  `;

  if (userRole === "student") {
    return {
      subject: `Welcome to ${collegeName} GradLink Network!`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to GradLink - Your Alumni Network Awaits!</title>
            <style>${baseStyles}</style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎓 GradLink</h1>
                    <p>Welcome to Your Alumni Network!</p>
                </div>

                <div class="content">
                    <div class="welcome-message">
                        <strong>Hi ${userName},</strong><br><br>
                        Welcome to GradLink! As a student, you now have access to an incredible network of alumni from your college who are ready to help you succeed. Connect with graduates in your field, discover amazing career opportunities, and become part of a thriving community.
                    </div>

                    <div class="features">
                        <div class="feature">
                            <div class="feature-icon">🤝</div>
                            <div class="feature-content">
                                <h3>Connect with Alumni Network</h3>
                                <p>Network with graduates from your college, search by major, graduation year, and skills to build meaningful professional relationships.</p>
                            </div>
                        </div>

                        <div class="feature">
                            <div class="feature-icon">💼</div>
                            <div class="feature-content">
                                <h3>Apply to Exclusive Jobs</h3>
                                <p>Access job postings from alumni, apply with your resume, and get matched with internships and full-time positions in your field.</p>
                            </div>
                        </div>

                        <div class="feature">
                            <div class="feature-icon">💬</div>
                            <div class="feature-content">
                                <h3>Share & Engage</h3>
                                <p>Create posts with media, like and comment on content, and engage with your college community through social features.</p>
                            </div>
                        </div>

                        <div class="feature">
                            <div class="feature-icon">💰</div>
                            <div class="feature-content">
                                <h3>Give Back to Your College</h3>
                                <p>Donate to college fundraising campaigns, support important causes, and help build a stronger community for future students.</p>
                            </div>
                        </div>
                    </div>

                    <div class="next-steps">
                        <h3>🚀 Your First Steps on GradLink:</h3>
                        <ul class="steps-list">
                            <li><strong>Complete Your Profile:</strong> Add your photo, bio, skills, major, and expected graduation year to make a great first impression</li>
                            <li><strong>Explore Alumni Network:</strong> Search for alumni by major, graduation year, or skills in your field of interest</li>
                            <li><strong>Browse Job Opportunities:</strong> Check out exclusive job postings from alumni and start applying to internships and full-time roles</li>
                            <li><strong>Join Conversations:</strong> Share your first post about your college experience and connect with the community</li>
                            <li><strong>Support College Causes:</strong> Explore fundraising campaigns and contribute to causes that matter to your college</li>
                        </ul>
                    </div>

                    <div class="support-section">
                        <h3>Need Help Getting Started?</h3>
                        <p>Our team is here to help you make the most of your GradLink experience. Don't hesitate to reach out if you have any questions or need assistance navigating the platform.</p>
                        <p><strong>Email:</strong> <a href="mailto:gradlink.platform@gmail.com>gradlink.platform@gmail.com</a></p>
                    </div>

                    <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #fff5f5; border-radius: 8px; border-left: 4px solid #f56565;">
                        <p><strong>💡 Pro Tip:</strong> The more complete your profile, the better alumni can discover you and the more relevant job opportunities you'll receive. Aim for 100% profile completion!</p>
                    </div>
                </div>

                <div class="footer">
                    <p><strong>Welcome aboard!</strong></p>
                    <p>The GradLink Team</p>
                    <p style="font-size: 0.9em; margin-top: 20px;">
                        GradLink - Connecting Students & Alumni
                    </p>
                </div>
            </div>
        </body>
        </html>
      `,
      text: `
        Welcome to ${collegeName} GradLink Network!

        Hi ${userName},

        Welcome to GradLink! As a student, you now have access to an incredible network of alumni from your college who are ready to help you succeed. Connect with graduates in your field, discover amazing career opportunities, and become part of a thriving community.

        What you can do on GradLink:
        • Connect with Alumni Network: Network with graduates from your college, search by major, graduation year, and skills to build meaningful professional relationships.
        • Apply to Exclusive Jobs: Access job postings from alumni, apply with your resume, and get matched with internships and full-time positions in your field.
        • Share & Engage: Create posts with media, like and comment on content, and engage with your college community through social features.
        • Give Back to Your College: Donate to college fundraising campaigns, support important causes, and help build a stronger community for future students.

        Your First Steps on GradLink:
        ✓ Complete Your Profile: Add your photo, bio, skills, major, and expected graduation year to make a great first impression
        ✓ Explore Alumni Network: Search for alumni by major, graduation year, or skills in your field of interest
        ✓ Browse Job Opportunities: Check out exclusive job postings from alumni and start applying to internships and full-time roles
        ✓ Join Conversations: Share your first post about your college experience and connect with the community
        ✓ Support College Causes: Explore fundraising campaigns and contribute to causes that matter to your college

        Need Help Getting Started?
        Our team is here to help you make the most of your GradLink experience. Don't hesitate to reach out if you have any questions or need assistance navigating the platform.

        Email: support@gradlink.com

        💡 Pro Tip: The more complete your profile, the better alumni can discover you and the more relevant job opportunities you'll receive. Aim for 100% profile completion!

        Welcome aboard!
        The GradLink Team

        GradLink - Connecting Students & Alumni
      `,
    };
  } else if (userRole === "alumni") {
    return {
      subject: `Welcome to ${collegeName} GradLink Network!`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to GradLink - Give Back to Your College Community!</title>
            <style>${baseStyles}</style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎓 GradLink</h1>
                    <p>Welcome Back to Your College Community!</p>
                </div>

                <div class="content">
                    <div class="welcome-message">
                        <strong>Hi ${userName},</strong><br><br>
                        Welcome to GradLink! As an alumnus, you have the unique opportunity to give back to your college community and help shape the next generation of graduates. Share job opportunities, connect with fellow alumni and current students, and make a meaningful impact on your alma mater.
                    </div>

                    <div class="features">
                        <div class="feature">
                            <div class="feature-icon">💼</div>
                            <div class="feature-content">
                                <h3>Post Job Opportunities</h3>
                                <p>Share exclusive job openings from your company, manage applications, and help students find internships and full-time positions.</p>
                            </div>
                        </div>

                        <div class="feature">
                            <div class="feature-icon">🤝</div>
                            <div class="feature-content">
                                <h3>Connect with Students & Alumni</h3>
                                <p>Network with current students and fellow alumni, share your professional journey, and build meaningful connections within your college community.</p>
                            </div>
                        </div>

                        <div class="feature">
                            <div class="feature-icon">💬</div>
                            <div class="feature-content">
                                <h3>Share Your Experience</h3>
                                <p>Post professional insights, share industry knowledge, and engage with the community through social features and discussions.</p>
                            </div>
                        </div>

                        <div class="feature">
                            <div class="feature-icon">💰</div>
                            <div class="feature-content">
                                <h3>Support College Initiatives</h3>
                                <p>Lead fundraising efforts, donate to college campaigns, and help build a stronger community for current and future students.</p>
                            </div>
                        </div>
                    </div>

                    <div class="next-steps">
                        <h3>🚀 Your First Steps on GradLink:</h3>
                        <ul class="steps-list">
                            <li><strong>Complete Your Profile:</strong> Add your professional details, current company, position, and skills to showcase your career journey</li>
                            <li><strong>Post Your First Job:</strong> Share opportunities from your company and help students find internships or full-time positions</li>
                            <li><strong>Connect with Students:</strong> Browse student profiles and start building relationships with the next generation</li>
                            <li><strong>Share Your Insights:</strong> Create your first post about your professional experience or industry knowledge</li>
                            <li><strong>Support Your College:</strong> Explore fundraising campaigns and contribute to causes that strengthen your alma mater</li>
                        </ul>
                    </div>

                    <div class="support-section">
                        <h3>Need Help Getting Started?</h3>
                        <p>Our team is here to help you make the most of your GradLink experience. Don't hesitate to reach out if you have any questions or need assistance navigating the platform.</p>
                        <p><strong>Email:</strong> <a href="mailto:support@gradlink.com">support@gradlink.com</a></p>
                    </div>

                    <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f0fff4; border-radius: 8px; border-left: 4px solid #48bb78;">
                        <p><strong>💡 Pro Tip:</strong> Students are eager to connect with alumni in their field. By posting job opportunities and sharing your professional journey, you can make a real difference in their career development!</p>
                    </div>
                </div>

                <div class="footer">
                    <p><strong>Thank you for giving back!</strong></p>
                    <p>The GradLink Team</p>
                    <p style="font-size: 0.9em; margin-top: 20px;">
                        GradLink - Connecting Students & Alumni
                    </p>
                </div>
            </div>
        </body>
        </html>
      `,
      text: `
        Welcome to ${collegeName} GradLink Network!

        Hi ${userName},

        Welcome to GradLink! As an alumnus, you have the unique opportunity to give back to your college community and help shape the next generation of graduates. Share job opportunities, connect with fellow alumni and current students, and make a meaningful impact on your alma mater.

        What you can do on GradLink:
        • Post Job Opportunities: Share exclusive job openings from your company, manage applications, and help students find internships and full-time positions.
        • Connect with Students & Alumni: Network with current students and fellow alumni, share your professional journey, and build meaningful connections within your college community.
        • Share Your Experience: Post professional insights, share industry knowledge, and engage with the community through social features and discussions.
        • Support College Initiatives: Lead fundraising efforts, donate to college campaigns, and help build a stronger community for current and future students.

        Your First Steps on GradLink:
        ✓ Complete Your Profile: Add your professional details, current company, position, and skills to showcase your career journey
        ✓ Post Your First Job: Share opportunities from your company and help students find internships or full-time positions
        ✓ Connect with Students: Browse student profiles and start building relationships with the next generation
        ✓ Share Your Insights: Create your first post about your professional experience or industry knowledge
        ✓ Support Your College: Explore fundraising campaigns and contribute to causes that strengthen your alma mater

        Need Help Getting Started?
        Our team is here to help you make the most of your GradLink experience. Don't hesitate to reach out if you have any questions or need assistance navigating the platform.

        Email: support@gradlink.com

        💡 Pro Tip: Students are eager to connect with alumni in their field. By posting job opportunities and sharing your professional journey, you can make a real difference in their career development!

        Thank you for giving back!
        The GradLink Team

        GradLink - Connecting Students & Alumni
      `,
    };
  }
};

const sendWelcomeEmail = async (userEmail, userName, collegeName, userRole) => {
  try {
    const emailTemplate = getWelcomeEmailTemplate(userRole, userName, collegeName);
    await sendMail(userEmail, emailTemplate.subject, emailTemplate.text, emailTemplate.html);
    console.log(`Welcome email sent successfully to ${userEmail}`);
  } catch (error) {
    console.error(`Failed to send welcome email to ${userEmail}:`, error);
  }
};

export { getWelcomeEmailTemplate, sendWelcomeEmail };
