

  {/* phone */}
  <div className="rv-phone">
    {/* notch */}
    <div style={{'position': 'absolute', 'top': '0', 'left': '50%', 'transform': 'translateX(-50%)', 'width': '150px', 'height': '30px', 'background': '#0c2615', 'borderRadius': '0 0 20px 20px', 'zIndex': '40'}}></div>
    {/* status bar */}
    <div style={{'position': '0', 'left': '0', 'right': '0', 'height': '52px', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between', 'padding': '0'}} 30px;font-size:14px;font-weight:700;color:statusColor;z-index:30>
      <span>9:41</span>
      <span style={{'display': 'flex', 'gap': '6px', 'alignItems': 'center', 'fontSize': '12px'}}>▟▟▟ &#160; 100%</span>
    </div>

    <div className="rv-scroll" style={{'position': 'absolute', 'inset': '0', 'overflowY': 'auto'}}>

      {/* ===== SPLASH ===== */}
      {isSplash && (
      <div className="rv-screen" style={{'minHeight': '820px', 'display': 'flex', 'flexDirection': 'column', 'background': 'linear-gradient(180deg,#f3f8f0 0%,#e7f0e2 46%,#12351d 46%,#0d2916 100%)'}}>
        <div style={{'flex': '1', 'display': 'flex', 'flexDirection': 'column', 'alignItems': 'center', 'justifyContent': 'center', 'padding': '70px 34px 20px', 'textAlign': 'center'}}>
          <img src="assets/logo-full.png" alt="Rivan Reality" style={{'width': '290px', 'height': 'auto', 'filter': 'drop-shadow(0 10px 24px rgba(18,53,29,.18))'}} />
          <p style={{'margin': '22px 0 0', 'fontSize': '15px', 'lineHeight': '1.55', 'color': '#4a5c4d', 'maxWidth': '250px', 'fontWeight': '500'}}>Your journey to a home you'll be proud to own — starts here.</p>
        </div>
        <div style={{'padding': '0 34px 46px', 'display': 'flex', 'flexDirection': 'column', 'gap': '14px'}}>
          <button onClick={goLogin} style={{'width': '100%', 'height': '58px', 'border': 'none', 'borderRadius': '18px', 'background': 'linear-gradient(180deg,#eb9236,#e2822a)', 'color': '#fff', 'fontFamily': 'inherit', 'fontSize': '16px', 'fontWeight': '700', 'cursor': 'pointer', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'gap': '10px', 'boxShadow': '0 12px 24px -8px rgba(226,130,42,.7)'}}>Get Started <span style={{'fontSize': '19px'}}>→</span></button>
          <button onClick={goSuccess} style={{'width': '100%', 'height': '58px', 'border': '1.5px solid rgba(255,255,255,.35)', 'borderRadius': '18px', 'background': 'rgba(255,255,255,.08)', 'color': '#eaf2e6', 'fontFamily': 'inherit', 'fontSize': '15px', 'fontWeight': '600', 'cursor': 'pointer'}}>Explore as Guest</button>
          <button onClick={goAgentLogin} style={{'width': '100%', 'height': '58px', 'border': '1.5px solid rgba(255,255,255,.35)', 'borderRadius': '18px', 'background': 'rgba(255,255,255,.08)', 'color': '#eaf2e6', 'fontFamily': 'inherit', 'fontSize': '15px', 'fontWeight': '600', 'cursor': 'pointer'}}>Agent Login</button>
          <button onClick={goAdminLogin} style={{'width': '100%', 'height': '58px', 'border': '1.5px solid rgba(255,255,255,.35)', 'borderRadius': '18px', 'background': 'rgba(255,255,255,.08)', 'color': '#eaf2e6', 'fontFamily': 'inherit', 'fontSize': '15px', 'fontWeight': '600', 'cursor': 'pointer'}}>Admin Login</button>


          <div style={{'display': 'flex', 'justifyContent': 'center', 'gap': '7px', 'marginTop': '6px'}}>
            <span style={{'width': '22px', 'height': '6px', 'borderRadius': '3px', 'background': '#eb9236'}}></span>
            <span style={{'width': '6px', 'height': '6px', 'borderRadius': '3px', 'background': 'rgba(255,255,255,.4)'}}></span>
            <span style={{'width': '6px', 'height': '6px', 'borderRadius': '3px', 'background': 'rgba(255,255,255,.4)'}}></span>
          </div>
        </div>
      </div>
      )}

      {/* ===== LOGIN ===== */}
      {isLogin && (
      <div className="rv-screen" style={{'minHeight': '820px', 'display': 'flex', 'flexDirection': 'column', 'padding': '64px 30px 34px', 'background': 'linear-gradient(180deg,#f4f8f1 0%,#ffffff 30%)'}}>
        <div style={{'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between'}}>
          <button onClick={goSplash} style={{'width': '42px', 'height': '42px', 'borderRadius': '13px', 'border': '1px solid #e4ece0', 'background': '#fff', 'color': '#12351d', 'fontSize': '19px', 'cursor': 'pointer'}}>←</button>
          <img src="assets/logo-mark.png" alt="Rivan" style={{'height': '38px', 'width': 'auto'}} />
        </div>
        <h1 style={{'margin': '26px 0 6px', 'fontSize': '28px', 'fontWeight': '800', 'color': '#12351d', 'letterSpacing': '-.5px'}}>Welcome back 👋</h1>
        <p style={{'margin': '0', 'fontSize': '14.5px', 'color': '#6d7d6f', 'lineHeight': '1.5'}}>Sign in to continue with Rivan Reality</p>

        {/* method toggle */}
        <div style={{'marginTop': '26px', 'display': 'flex', 'background': '#eef3ec', 'borderRadius': '15px', 'padding': '5px', 'gap': '5px'}}>
          <button onClick={setPhone} style={phoneTabStyle}>Phone</button>
          <button onClick={setEmail} style={emailTabStyle}>Email</button>
        </div>

        {/* phone field */}
        {isPhoneMethod && (
        <div style={{'marginTop': '22px'}}>
          <label style={{'fontSize': '13px', 'fontWeight': '700', 'color': '#3d4f40'}}>Mobile Number</label>
          <div style={{'marginTop': '9px', 'display': 'flex', 'alignItems': 'center', 'gap': '10px', 'height': '56px', 'border': '1.5px solid #e2e8e0', 'borderRadius': '16px', 'padding': '0 16px', 'background': '#fbfdfa'}}>
            <span style={{'display': 'flex', 'alignItems': 'center', 'gap': '6px', 'fontSize': '15px', 'fontWeight': '700', 'color': '#12351d', 'borderRight': '1.5px solid #e2e8e0', 'paddingRight': '12px'}}>🇮🇳 +91</span>
            <input inputmode="numeric" placeholder="98765 43210" style={{'flex': '1', 'border': 'none', 'background': 'transparent', 'fontFamily': 'inherit', 'fontSize': '15.5px', 'fontWeight': '600', 'color': '#16231a'}}/>
          </div>
        </div>
        )}

        {/* email field */}
        {isEmailMethod && (
        <div style={{'marginTop': '22px'}}>
          <label style={{'fontSize': '13px', 'fontWeight': '700', 'color': '#3d4f40'}}>Email Address</label>
          <div style={{'marginTop': '9px', 'display': 'flex', 'alignItems': 'center', 'gap': '10px', 'height': '56px', 'border': '1.5px solid #e2e8e0', 'borderRadius': '16px', 'padding': '0 16px', 'background': '#fbfdfa'}}>
            <span style={{'fontSize': '16px'}}>✉️</span>
            <input type="email" placeholder="you@email.com" style={{'flex': '1', 'border': 'none', 'background': 'transparent', 'fontFamily': 'inherit', 'fontSize': '15.5px', 'fontWeight': '600', 'color': '#16231a'}}/>
          </div>
        </div>
        )}

        {/* password (only in password mode) */}
        {isPasswordAuth && (
        <div style={{'marginTop': '18px'}}>
          <label style={{'fontSize': '13px', 'fontWeight': '700', 'color': '#3d4f40'}}>Password</label>
          <div style={{'marginTop': '9px', 'display': 'flex', 'alignItems': 'center', 'gap': '10px', 'height': '56px', 'border': '1.5px solid #e2e8e0', 'borderRadius': '16px', 'padding': '0 16px', 'background': '#fbfdfa'}}>
            <span style={{'fontSize': '15px'}}>🔒</span>
            <input type={pwType} placeholder="Enter your password" style={{'flex': '1', 'border': 'none', 'background': 'transparent', 'fontFamily': 'inherit', 'fontSize': '15.5px', 'fontWeight': '600', 'color': '#16231a'}}/>
            <button onClick={toggleShowPw} style={{'border': 'none', 'background': 'transparent', 'cursor': 'pointer', 'fontSize': '16px', 'color': '#8a988c'}}>{pwEye}</button>
          </div>
          <div style={{'textAlign': 'right', 'marginTop': '10px'}}><a style={{'fontSize': '13px', 'fontWeight': '700', 'color': '#e2822a', 'textDecoration': 'none', 'cursor': 'pointer'}}>Forgot Password?</a></div>
        </div>
        )}

        {/* auth mode switch */}
        <div style={{'marginTop': '20px', 'display': 'flex', 'alignItems': 'center', 'gap': '8px', 'fontSize': '13px', 'color': '#6d7d6f'}}>
          <span>{authSwitchLabel}</span>
          <a onClick={toggleAuthMode} style={{'fontWeight': '700', 'color': '#12351d', 'textDecoration': 'underline', 'cursor': 'pointer'}}>{authSwitchAction}</a>
        </div>

        <button onClick={loginContinue} style={{'marginTop': '24px', 'width': '100%', 'height': '58px', 'border': 'none', 'borderRadius': '18px', 'background': 'linear-gradient(180deg,#1a5e2e,#124423)', 'color': '#fff', 'fontFamily': 'inherit', 'fontSize': '16px', 'fontWeight': '700', 'cursor': 'pointer', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'gap': '10px', 'boxShadow': '0 14px 26px -10px rgba(18,68,35,.75)'}}>{loginBtnLabel} <span style={{'fontSize': '19px'}}>→</span></button>

        <div style={{'display': 'flex', 'alignItems': 'center', 'gap': '12px', 'margin': '26px 0'}}>
          <span style={{'flex': '1', 'height': '1px', 'background': '#e2e8e0'}}></span>
          <span style={{'fontSize': '12.5px', 'color': '#9aa89c', 'fontWeight': '600'}}>or continue with</span>
          <span style={{'flex': '1', 'height': '1px', 'background': '#e2e8e0'}}></span>
        </div>
        <div style={{'display': 'flex', 'gap': '12px'}}>
          <button style={{'flex': '1', 'height': '54px', 'border': '1.5px solid #e2e8e0', 'borderRadius': '15px', 'background': '#fff', 'fontSize': '20px', 'cursor': 'pointer', 'fontFamily': 'inherit', 'color': '#4285F4', 'fontWeight': '800'}}>G</button>
          <button style={{'flex': '1', 'height': '54px', 'border': '1.5px solid #e2e8e0', 'borderRadius': '15px', 'background': '#fff', 'fontSize': '20px', 'cursor': 'pointer'}}></button>
          <button style={{'flex': '1', 'height': '54px', 'border': '1.5px solid #e2e8e0', 'borderRadius': '15px', 'background': '#fff', 'fontSize': '20px', 'cursor': 'pointer', 'color': '#1877F2', 'fontWeight': '800', 'fontFamily': 'inherit'}}>f</button>
        </div>
        <p style={{'textAlign': 'center', 'margin': '24px 0 0', 'fontSize': '13.5px', 'color': '#6d7d6f'}}>Don't have an account? <a onClick={goProfile} style={{'fontWeight': '700', 'color': '#e2822a', 'cursor': 'pointer'}}>Sign Up</a></p>
      </div>
      )}

      {/* ===== AGENT LOGIN ===== */}
      {isAgentLogin && (
      <div className="rv-screen" style={{'minHeight': '820px', 'display': 'flex', 'flexDirection': 'column', 'padding': '64px 30px 34px', 'background': 'linear-gradient(180deg,#f4f8f1 0%,#ffffff 30%)'}}>
        <div style={{'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between'}}>
          <button onClick={goSplash} style={{'width': '42px', 'height': '42px', 'borderRadius': '13px', 'border': '1px solid #e4ece0', 'background': '#fff', 'color': '#12351d', 'fontSize': '19px', 'cursor': 'pointer'}}>←</button>
          <img src="assets/logo-mark.png" alt="Rivan" style={{'height': '38px', 'width': 'auto'}} />
        </div>
        <h1 style={{'margin': '26px 0 6px', 'fontSize': '28px', 'fontWeight': '800', 'color': '#12351d', 'letterSpacing': '-.5px'}}>Agent Portal</h1>
        <p style={{'margin': '0', 'fontSize': '14.5px', 'color': '#6d7d6f', 'lineHeight': '1.5'}}>Sign in as a Rivan Agent</p>

        {/* method toggle */}
        <div style={{'marginTop': '26px', 'display': 'flex', 'background': '#eef3ec', 'borderRadius': '15px', 'padding': '5px', 'gap': '5px'}}>
          <button onClick={setPhone} style={phoneTabStyle}>Phone</button>
          <button onClick={setEmail} style={emailTabStyle}>Email</button>
        </div>

        {/* phone field */}
        {isPhoneMethod && (
        <div style={{'marginTop': '22px'}}>
          <label style={{'fontSize': '13px', 'fontWeight': '700', 'color': '#3d4f40'}}>Mobile Number</label>
          <div style={{'marginTop': '9px', 'display': 'flex', 'alignItems': 'center', 'gap': '10px', 'height': '56px', 'border': '1.5px solid #e2e8e0', 'borderRadius': '16px', 'padding': '0 16px', 'background': '#fbfdfa'}}>
            <span style={{'display': 'flex', 'alignItems': 'center', 'gap': '6px', 'fontSize': '15px', 'fontWeight': '700', 'color': '#12351d', 'borderRight': '1.5px solid #e2e8e0', 'paddingRight': '12px'}}>🇮🇳 +91</span>
            <input inputmode="numeric" placeholder="98765 43210" style={{'flex': '1', 'border': 'none', 'background': 'transparent', 'fontFamily': 'inherit', 'fontSize': '15.5px', 'fontWeight': '600', 'color': '#16231a'}}/>
          </div>
        </div>
        )}

        {/* email field */}
        {isEmailMethod && (
        <div style={{'marginTop': '22px'}}>
          <label style={{'fontSize': '13px', 'fontWeight': '700', 'color': '#3d4f40'}}>Email Address</label>
          <div style={{'marginTop': '9px', 'display': 'flex', 'alignItems': 'center', 'gap': '10px', 'height': '56px', 'border': '1.5px solid #e2e8e0', 'borderRadius': '16px', 'padding': '0 16px', 'background': '#fbfdfa'}}>
            <span style={{'fontSize': '16px'}}>✉️</span>
            <input type="email" placeholder="you@email.com" style={{'flex': '1', 'border': 'none', 'background': 'transparent', 'fontFamily': 'inherit', 'fontSize': '15.5px', 'fontWeight': '600', 'color': '#16231a'}}/>
          </div>
        </div>
        )}

        {/* password (only in password mode) */}
        {isPasswordAuth && (
        <div style={{'marginTop': '18px'}}>
          <label style={{'fontSize': '13px', 'fontWeight': '700', 'color': '#3d4f40'}}>Password</label>
          <div style={{'marginTop': '9px', 'display': 'flex', 'alignItems': 'center', 'gap': '10px', 'height': '56px', 'border': '1.5px solid #e2e8e0', 'borderRadius': '16px', 'padding': '0 16px', 'background': '#fbfdfa'}}>
            <span style={{'fontSize': '15px'}}>🔒</span>
            <input type={pwType} placeholder="Enter your password" style={{'flex': '1', 'border': 'none', 'background': 'transparent', 'fontFamily': 'inherit', 'fontSize': '15.5px', 'fontWeight': '600', 'color': '#16231a'}}/>
            <button onClick={toggleShowPw} style={{'border': 'none', 'background': 'transparent', 'cursor': 'pointer', 'fontSize': '16px', 'color': '#8a988c'}}>{pwEye}</button>
          </div>
          <div style={{'textAlign': 'right', 'marginTop': '10px'}}><a style={{'fontSize': '13px', 'fontWeight': '700', 'color': '#e2822a', 'textDecoration': 'none', 'cursor': 'pointer'}}>Forgot Password?</a></div>
        </div>
        )}

        {/* auth mode switch */}
        <div style={{'marginTop': '20px', 'display': 'flex', 'alignItems': 'center', 'gap': '8px', 'fontSize': '13px', 'color': '#6d7d6f'}}>
          <span>{authSwitchLabel}</span>
          <a onClick={toggleAuthMode} style={{'fontWeight': '700', 'color': '#12351d', 'textDecoration': 'underline', 'cursor': 'pointer'}}>{authSwitchAction}</a>
        </div>

        <button onClick={goAgentDash} style={{'marginTop': '24px', 'width': '100%', 'height': '58px', 'border': 'none', 'borderRadius': '18px', 'background': 'linear-gradient(180deg,#1a5e2e,#124423)', 'color': '#fff', 'fontFamily': 'inherit', 'fontSize': '16px', 'fontWeight': '700', 'cursor': 'pointer', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'gap': '10px', 'boxShadow': '0 14px 26px -10px rgba(18,68,35,.75)'}}>Access Dashboard <span style={{'fontSize': '19px'}}>→</span></button>

        <div style={{'display': 'flex', 'alignItems': 'center', 'gap': '12px', 'margin': '26px 0'}}>
          <span style={{'flex': '1', 'height': '1px', 'background': '#e2e8e0'}}></span>
          <span style={{'fontSize': '12.5px', 'color': '#9aa89c', 'fontWeight': '600'}}>or continue with</span>
          <span style={{'flex': '1', 'height': '1px', 'background': '#e2e8e0'}}></span>
        </div>
        <div style={{'display': 'flex', 'gap': '12px'}}>
          <button style={{'flex': '1', 'height': '54px', 'border': '1.5px solid #e2e8e0', 'borderRadius': '15px', 'background': '#fff', 'fontSize': '20px', 'cursor': 'pointer', 'fontFamily': 'inherit', 'color': '#4285F4', 'fontWeight': '800'}}>G</button>
          <button style={{'flex': '1', 'height': '54px', 'border': '1.5px solid #e2e8e0', 'borderRadius': '15px', 'background': '#fff', 'fontSize': '20px', 'cursor': 'pointer'}}></button>
          <button style={{'flex': '1', 'height': '54px', 'border': '1.5px solid #e2e8e0', 'borderRadius': '15px', 'background': '#fff', 'fontSize': '20px', 'cursor': 'pointer', 'color': '#1877F2', 'fontWeight': '800', 'fontFamily': 'inherit'}}>f</button>
        </div>
        <p style={{'textAlign': 'center', 'margin': '24px 0 0', 'fontSize': '13.5px', 'color': '#6d7d6f'}}>Don't have an account? <a onClick={goProfile} style={{'fontWeight': '700', 'color': '#e2822a', 'cursor': 'pointer'}}>Sign Up</a></p>
      </div>
      )}

      {/* ===== ADMIN LOGIN ===== */}
      {isAdminLogin && (
      <div className="rv-screen" style={{'minHeight': '820px', 'display': 'flex', 'flexDirection': 'column', 'padding': '64px 30px 34px', 'background': 'linear-gradient(180deg,#f4f8f1 0%,#ffffff 30%)'}}>
        <div style={{'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between'}}>
          <button onClick={goSplash} style={{'width': '42px', 'height': '42px', 'borderRadius': '13px', 'border': '1px solid #e4ece0', 'background': '#fff', 'color': '#12351d', 'fontSize': '19px', 'cursor': 'pointer'}}>←</button>
          <img src="assets/logo-mark.png" alt="Rivan" style={{'height': '38px', 'width': 'auto'}} />
        </div>
        <h1 style={{'margin': '26px 0 6px', 'fontSize': '28px', 'fontWeight': '800', 'color': '#12351d', 'letterSpacing': '-.5px'}}>Admin Portal</h1>
        <p style={{'margin': '0', 'fontSize': '14.5px', 'color': '#6d7d6f', 'lineHeight': '1.5'}}>Sign in as a Rivan Admin</p>

        {/* method toggle */}
        <div style={{'marginTop': '26px', 'display': 'flex', 'background': '#eef3ec', 'borderRadius': '15px', 'padding': '5px', 'gap': '5px'}}>
          <button onClick={setPhone} style={phoneTabStyle}>Phone</button>
          <button onClick={setEmail} style={emailTabStyle}>Email</button>
        </div>

        {/* phone field */}
        {isPhoneMethod && (
        <div style={{'marginTop': '22px'}}>
          <label style={{'fontSize': '13px', 'fontWeight': '700', 'color': '#3d4f40'}}>Mobile Number</label>
          <div style={{'marginTop': '9px', 'display': 'flex', 'alignItems': 'center', 'gap': '10px', 'height': '56px', 'border': '1.5px solid #e2e8e0', 'borderRadius': '16px', 'padding': '0 16px', 'background': '#fbfdfa'}}>
            <span style={{'display': 'flex', 'alignItems': 'center', 'gap': '6px', 'fontSize': '15px', 'fontWeight': '700', 'color': '#12351d', 'borderRight': '1.5px solid #e2e8e0', 'paddingRight': '12px'}}>🇮🇳 +91</span>
            <input inputmode="numeric" placeholder="98765 43210" style={{'flex': '1', 'border': 'none', 'background': 'transparent', 'fontFamily': 'inherit', 'fontSize': '15.5px', 'fontWeight': '600', 'color': '#16231a'}}/>
          </div>
        </div>
        )}

        {/* email field */}
        {isEmailMethod && (
        <div style={{'marginTop': '22px'}}>
          <label style={{'fontSize': '13px', 'fontWeight': '700', 'color': '#3d4f40'}}>Email Address</label>
          <div style={{'marginTop': '9px', 'display': 'flex', 'alignItems': 'center', 'gap': '10px', 'height': '56px', 'border': '1.5px solid #e2e8e0', 'borderRadius': '16px', 'padding': '0 16px', 'background': '#fbfdfa'}}>
            <span style={{'fontSize': '16px'}}>✉️</span>
            <input type="email" placeholder="you@email.com" style={{'flex': '1', 'border': 'none', 'background': 'transparent', 'fontFamily': 'inherit', 'fontSize': '15.5px', 'fontWeight': '600', 'color': '#16231a'}}/>
          </div>
        </div>
        )}

        {/* password (only in password mode) */}
        {isPasswordAuth && (
        <div style={{'marginTop': '18px'}}>
          <label style={{'fontSize': '13px', 'fontWeight': '700', 'color': '#3d4f40'}}>Password</label>
          <div style={{'marginTop': '9px', 'display': 'flex', 'alignItems': 'center', 'gap': '10px', 'height': '56px', 'border': '1.5px solid #e2e8e0', 'borderRadius': '16px', 'padding': '0 16px', 'background': '#fbfdfa'}}>
            <span style={{'fontSize': '15px'}}>🔒</span>
            <input type={pwType} placeholder="Enter your password" style={{'flex': '1', 'border': 'none', 'background': 'transparent', 'fontFamily': 'inherit', 'fontSize': '15.5px', 'fontWeight': '600', 'color': '#16231a'}}/>
            <button onClick={toggleShowPw} style={{'border': 'none', 'background': 'transparent', 'cursor': 'pointer', 'fontSize': '16px', 'color': '#8a988c'}}>{pwEye}</button>
          </div>
          <div style={{'textAlign': 'right', 'marginTop': '10px'}}><a style={{'fontSize': '13px', 'fontWeight': '700', 'color': '#e2822a', 'textDecoration': 'none', 'cursor': 'pointer'}}>Forgot Password?</a></div>
        </div>
        )}

        {/* auth mode switch */}
        <div style={{'marginTop': '20px', 'display': 'flex', 'alignItems': 'center', 'gap': '8px', 'fontSize': '13px', 'color': '#6d7d6f'}}>
          <span>{authSwitchLabel}</span>
          <a onClick={toggleAuthMode} style={{'fontWeight': '700', 'color': '#12351d', 'textDecoration': 'underline', 'cursor': 'pointer'}}>{authSwitchAction}</a>
        </div>

        <button onClick={goAdminDash} style={{'marginTop': '24px', 'width': '100%', 'height': '58px', 'border': 'none', 'borderRadius': '18px', 'background': 'linear-gradient(180deg,#1a5e2e,#124423)', 'color': '#fff', 'fontFamily': 'inherit', 'fontSize': '16px', 'fontWeight': '700', 'cursor': 'pointer', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'gap': '10px', 'boxShadow': '0 14px 26px -10px rgba(18,68,35,.75)'}}>Access Dashboard <span style={{'fontSize': '19px'}}>→</span></button>

        <div style={{'display': 'flex', 'alignItems': 'center', 'gap': '12px', 'margin': '26px 0'}}>
          <span style={{'flex': '1', 'height': '1px', 'background': '#e2e8e0'}}></span>
          <span style={{'fontSize': '12.5px', 'color': '#9aa89c', 'fontWeight': '600'}}>or continue with</span>
          <span style={{'flex': '1', 'height': '1px', 'background': '#e2e8e0'}}></span>
        </div>
        <div style={{'display': 'flex', 'gap': '12px'}}>
          <button style={{'flex': '1', 'height': '54px', 'border': '1.5px solid #e2e8e0', 'borderRadius': '15px', 'background': '#fff', 'fontSize': '20px', 'cursor': 'pointer', 'fontFamily': 'inherit', 'color': '#4285F4', 'fontWeight': '800'}}>G</button>
          <button style={{'flex': '1', 'height': '54px', 'border': '1.5px solid #e2e8e0', 'borderRadius': '15px', 'background': '#fff', 'fontSize': '20px', 'cursor': 'pointer'}}></button>
          <button style={{'flex': '1', 'height': '54px', 'border': '1.5px solid #e2e8e0', 'borderRadius': '15px', 'background': '#fff', 'fontSize': '20px', 'cursor': 'pointer', 'color': '#1877F2', 'fontWeight': '800', 'fontFamily': 'inherit'}}>f</button>
        </div>
        <p style={{'textAlign': 'center', 'margin': '24px 0 0', 'fontSize': '13.5px', 'color': '#6d7d6f'}}>Don't have an account? <a onClick={goProfile} style={{'fontWeight': '700', 'color': '#e2822a', 'cursor': 'pointer'}}>Sign Up</a></p>
      </div>
      )}

      {/* ===== OTP ===== */}
      {isOtp && (
      <div className="rv-screen" style={{'minHeight': '820px', 'display': 'flex', 'flexDirection': 'column', 'padding': '64px 30px 34px', 'background': 'linear-gradient(180deg,#f4f8f1 0%,#ffffff 30%)'}}>
        <button onClick={goLogin} style={{'width': '42px', 'height': '42px', 'borderRadius': '13px', 'border': '1px solid #e4ece0', 'background': '#fff', 'color': '#12351d', 'fontSize': '19px', 'cursor': 'pointer'}}>←</button>
        <div style={{'margin': '30px auto 0', 'width': '80px', 'height': '80px', 'borderRadius': '24px', 'background': '#eef6ea', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'fontSize': '34px'}}>💬</div>
        <h1 style={{'margin': '24px 0 8px', 'fontSize': '26px', 'fontWeight': '800', 'color': '#12351d', 'textAlign': 'center', 'letterSpacing': '-.5px'}}>Verify your number</h1>
        <p style={{'margin': '0', 'fontSize': '14.5px', 'color': '#6d7d6f', 'lineHeight': '1.55', 'textAlign': 'center'}}>Enter the 6-digit code we sent to<br><strong style={{'color': '#16231a'}}>+91 98765 43210</strong></p>
        <div style={{'display': 'flex', 'justifyContent': 'center', 'gap': '10px', 'marginTop': '32px'}}>
          { otpList.map((d, index) => (
            <input data-otp={d.idx} value={d.val} onInput={d.onInput} onKeyDown={d.onKey} inputmode="numeric" maxlength="1" style={{'width': '48px', 'height': '58px', 'textAlign': 'center', 'fontFamily': 'inherit', 'fontSize': '22px', 'fontWeight': '800', 'color': '#12351d', 'border': '1.5px solid #d7e0d3', 'borderRadius': '15px', 'background': '#fbfdfa'}}/>
          ))}
        </div>
        <p style={{'textAlign': 'center', 'margin': '26px 0 0', 'fontSize': '13.5px', 'color': '#6d7d6f'}}>Didn't get the code? <a style={{'fontWeight': '700', 'color': '#e2822a', 'cursor': 'pointer'}}>Resend in 0:24</a></p>
        <button onClick={goProfile} style={{'marginTop': 'auto', 'width': '100%', 'height': '58px', 'border': 'none', 'borderRadius': '18px', 'background': 'linear-gradient(180deg,#1a5e2e,#124423)', 'color': '#fff', 'fontFamily': 'inherit', 'fontSize': '16px', 'fontWeight': '700', 'cursor': 'pointer', 'boxShadow': '0 14px 26px -10px rgba(18,68,35,.75)'}}>Verify & Continue</button>
      </div>
      )}

      {/* ===== PROFILE ===== */}
      {isProfile && (
      <div className="rv-screen" style={{'minHeight': '820px', 'display': 'flex', 'flexDirection': 'column', 'padding': '60px 30px 34px', 'background': 'linear-gradient(180deg,#f4f8f1 0%,#ffffff 26%)'}}>
        <div style={{'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between'}}>
          <button onClick={goLogin} style={{'width': '42px', 'height': '42px', 'borderRadius': '13px', 'border': '1px solid #e4ece0', 'background': '#fff', 'color': '#12351d', 'fontSize': '19px', 'cursor': 'pointer'}}>←</button>
          <a onClick={goSuccess} style={{'fontSize': '14px', 'fontWeight': '700', 'color': '#6d7d6f', 'cursor': 'pointer'}}>Skip for Now</a>
        </div>
        <h1 style={{'margin': '22px 0 6px', 'fontSize': '26px', 'fontWeight': '800', 'color': '#12351d', 'letterSpacing': '-.5px'}}>Set up your profile</h1>
        <p style={{'margin': '0 0 8px', 'fontSize': '14.5px', 'color': '#6d7d6f', 'lineHeight': '1.5'}}>Tell us a little about you so we can match the right properties.</p>

        <label style={{'marginTop': '18px', 'fontSize': '13px', 'fontWeight': '700', 'color': '#3d4f40'}}>Full Name</label>
        <div style={{'marginTop': '8px', 'display': 'flex', 'alignItems': 'center', 'gap': '10px', 'height': '54px', 'border': '1.5px solid #e2e8e0', 'borderRadius': '15px', 'padding': '0 15px', 'background': '#fbfdfa'}}>
          <span>👤</span><input placeholder="Aarav Sharma" style={{'flex': '1', 'border': 'none', 'background': 'transparent', 'fontFamily': 'inherit', 'fontSize': '15px', 'fontWeight': '600', 'color': '#16231a'}}/>
        </div>

        <label style={{'marginTop': '15px', 'fontSize': '13px', 'fontWeight': '700', 'color': '#3d4f40'}}>Phone Number</label>
        <div style={{'marginTop': '8px', 'display': 'flex', 'alignItems': 'center', 'gap': '10px', 'height': '54px', 'border': '1.5px solid #e2e8e0', 'borderRadius': '15px', 'padding': '0 15px', 'background': '#fbfdfa'}}>
          <span style={{'fontWeight': '700', 'color': '#12351d', 'fontSize': '14px', 'borderRight': '1.5px solid #e2e8e0', 'paddingRight': '10px'}}>+91</span><input inputmode="numeric" value="98765 43210" style={{'flex': '1', 'border': 'none', 'background': 'transparent', 'fontFamily': 'inherit', 'fontSize': '15px', 'fontWeight': '600', 'color': '#16231a'}}/>
          <span style={{'color': '#1a5e2e', 'fontSize': '16px'}}>✓</span>
        </div>

        <label style={{'marginTop': '15px', 'fontSize': '13px', 'fontWeight': '700', 'color': '#3d4f40'}}>Email Address</label>
        <div style={{'marginTop': '8px', 'display': 'flex', 'alignItems': 'center', 'gap': '10px', 'height': '54px', 'border': '1.5px solid #e2e8e0', 'borderRadius': '15px', 'padding': '0 15px', 'background': '#fbfdfa'}}>
          <span>✉️</span><input type="email" placeholder="aarav@email.com" style={{'flex': '1', 'border': 'none', 'background': 'transparent', 'fontFamily': 'inherit', 'fontSize': '15px', 'fontWeight': '600', 'color': '#16231a'}}/>
        </div>

        <label style={{'marginTop': '15px', 'fontSize': '13px', 'fontWeight': '700', 'color': '#3d4f40'}}>City</label>
        <div style={{'marginTop': '8px', 'display': 'flex', 'alignItems': 'center', 'gap': '10px', 'height': '54px', 'border': '1.5px solid #e2e8e0', 'borderRadius': '15px', 'padding': '0 15px', 'background': '#fbfdfa'}}>
          <span>📍</span>
          <select style={{'flex': '1', 'border': 'none', 'background': 'transparent', 'fontFamily': 'inherit', 'fontSize': '15px', 'fontWeight': '600', 'color': '#16231a', 'WebkitAppearance': 'none', 'appearance': 'none', 'cursor': 'pointer'}}>
            <option>Hyderabad</option><option>Visakhapatnam</option><option>Bengaluru</option><option>Mumbai</option><option>Pune</option><option>Chennai</option><option>Delhi NCR</option>
          </select>
          <span style={{'color': '#8a988c'}}>▾</span>
        </div>

        <label style={{'marginTop': '18px', 'fontSize': '13px', 'fontWeight': '700', 'color': '#3d4f40'}}>Interested Property Type</label>
        <div style={{'marginTop': '11px', 'display': 'flex', 'flexWrap': 'wrap', 'gap': '9px'}}>
          { propList.map((p, index) => (
            <button onClick={p.toggle} style={p.style}>{p.label}</button>
          ))}
        </div>

        <button onClick={goSuccess} style={{'marginTop': '26px', 'width': '100%', 'height': '58px', 'border': 'none', 'borderRadius': '18px', 'background': 'linear-gradient(180deg,#eb9236,#e2822a)', 'color': '#fff', 'fontFamily': 'inherit', 'fontSize': '16px', 'fontWeight': '700', 'cursor': 'pointer', 'boxShadow': '0 14px 26px -10px rgba(226,130,42,.6)'}}>Create Profile</button>
        <p style={{'textAlign': 'center', 'margin': '14px 0 0', 'fontSize': '12px', 'color': '#9aa89c', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'gap': '6px'}}>🔒 Your information is secure & private</p>
      </div>
      )}

      {/* ===== SUCCESS ===== */}
      {isSuccess && (
      <div className="rv-screen" style={{'minHeight': '820px', 'display': 'flex', 'flexDirection': 'column', 'alignItems': 'center', 'justifyContent': 'center', 'textAlign': 'center', 'padding': '40px 34px', 'background': 'linear-gradient(180deg,#12351d 0%,#0d2916 100%)'}}>
        <div style={{'width': '104px', 'height': '104px', 'borderRadius': '34px', 'background': 'linear-gradient(180deg,#eb9236,#e2822a)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'fontSize': '48px', 'color': '#fff', 'boxShadow': '0 18px 40px -12px rgba(226,130,42,.8)'}}>✓</div>
        <img src="assets/logo-mark.png" alt="Rivan" style={{'width': '70px', 'marginTop': '30px', 'filter': 'brightness(0) invert(1) sepia(0)'}} />
        <h1 style={{'margin': '20px 0 8px', 'fontSize': '28px', 'fontWeight': '800', 'color': '#fff', 'letterSpacing': '-.5px'}}>You're all set!</h1>
        <p style={{'margin': '0', 'fontSize': '15px', 'color': '#b8cbb6', 'lineHeight': '1.55', 'maxWidth': '260px'}}>Welcome to Rivan Reality. Let's find the home that builds your legacy.</p>
        <div style={{'display': 'flex', 'gap': '22px', 'marginTop': '34px', 'color': '#8fae8c', 'fontSize': '12.5px', 'fontWeight': '700'}}>
          <span>Secure</span><span style={{'color': '#4a6b4a'}}>•</span><span>Transparent</span><span style={{'color': '#4a6b4a'}}>•</span><span>Trusted</span>
        </div>
        <button onClick={goApp} style={{'marginTop': '38px', 'width': '100%', 'height': '58px', 'border': 'none', 'borderRadius': '18px', 'background': '#fff', 'color': '#12351d', 'fontFamily': 'inherit', 'fontSize': '16px', 'fontWeight': '700', 'cursor': 'pointer'}}>Explore Properties</button>
      </div>
      )}

    </div>
  </div>

  