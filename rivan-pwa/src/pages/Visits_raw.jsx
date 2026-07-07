

  <div className="rv-phone">
    <div style={{'position': 'absolute', 'top': '0', 'left': '50%', 'transform': 'translateX(-50%)', 'width': '150px', 'height': '30px', 'background': '#0c2615', 'borderRadius': '0 0 20px 20px', 'zIndex': '60'}}></div>
    <div style={{'position': '0', 'left': '0', 'right': '0', 'height': '50px', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between', 'padding': '0'}} 28px;font-size:13.5px;font-weight:700;color:statusColor;z-index:50;pointer-events:none>
      <span>9:41</span><span style={{'fontSize': '11px', 'letterSpacing': '1px'}}>▟▟▟ 100%</span>
    </div>

    <div className="rv-scroll" style={{'position': 'absolute', 'inset': '0', 'overflowY': 'auto'}}>

      {/* ===================== VISITS HOME ===================== */}
      {isVisits && (
      <div className="rv-screen">
        <div style={{'background': 'linear-gradient(160deg,#1a5e2e 0%,#123f21 100%)', 'padding': '56px 22px 20px', 'borderRadius': '0 0 26px 26px'}}>
          <div style={{'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between'}}>
            <div style={{'display': 'flex', 'alignItems': 'center', 'gap': '10px'}}>
              <img src="assets/logo-mark-white.png" alt="Rivan" style={{'height': '26px', 'opacity': '.95'}} />
              <span style={{'fontSize': '19px', 'fontWeight': '800', 'color': '#fff'}}>My Visits</span>
            </div>
            <button style={{'width': '40px', 'height': '40px', 'borderRadius': '12px', 'border': 'none', 'background': 'rgba(255,255,255,.14)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'cursor': 'pointer'}}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 20a2 2 0 0 0 4 0"/></svg>
            </button>
          </div>
          <p style={{'margin': '12px 0 0', 'fontSize': '13px', 'color': '#bcd6bd', 'fontWeight': '500'}}>Manage all your property site visits in one place</p>
          <div style={{'marginTop': '16px', 'display': 'flex', 'background': 'rgba(255,255,255,.12)', 'borderRadius': '14px', 'padding': '5px', 'gap': '5px'}}>
            { tabs.map((t, index) => (
              <button onClick={t.pick} style={t.style}>{t.label}</button>
            ))}
          </div>
        </div>

        <div style={{'padding': '18px 22px 0'}}>
          {/* EMPTY */}
          {listEmpty && (
          <div style={{'display': 'flex', 'flexDirection': 'column', 'alignItems': 'center', 'textAlign': 'center', 'padding': '56px 24px'}}>
            <div style={{'width': '90px', 'height': '90px', 'borderRadius': '28px', 'background': '#eef6ea', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center'}}>
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#8fae8c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4"/></svg>
            </div>
            <p style={{'margin': '20px 0 6px', 'fontSize': '16px', 'fontWeight': '800', 'color': '#12351d'}}>{emptyTitle}</p>
            <p style={{'margin': '0 0 22px', 'fontSize': '13px', 'color': '#8a988c', 'maxWidth': '230px', 'lineHeight': '1.5'}}>{emptyText}</p>
            <button style={{'height': '50px', 'padding': '0 28px', 'border': 'none', 'borderRadius': '15px', 'background': 'linear-gradient(180deg,#eb9236,#e2822a)', 'color': '#fff', 'fontFamily': 'inherit', 'fontSize': '14.5px', 'fontWeight': '700', 'cursor': 'pointer', 'boxShadow': '0 12px 24px -10px rgba(226,130,42,.6)'}}>Book a Site Visit</button>
          </div>
          )}

          {/* LIST */}
          {listShow && (
          <div style={{'display': 'flex', 'flexDirection': 'column', 'gap': '16px'}}>
            { visits.map((v, index) => (
              <div style={{'background': '#fff', 'borderRadius': '22px', 'border': '1px solid #eef3ec', 'overflow': 'hidden', 'boxShadow': '0 14px 34px -24px rgba(18,53,29,.55)'}}>
                {/* countdown strip (upcoming only) */}
                {v.showCountdown && (
                <div style={{'display': 'center', 'gap': '8px', 'padding': '10px'}} 16px;background:v.cdBg>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={v.cdColor} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M12 7v5l3 2"/></svg>
                  <span style={font}-size:12px;font-weight:700;color:v.cdColor>{v.countdown}</span>
                </div>
                )}
                <div onClick={v.open} style={{'padding': '14px', 'cursor': 'pointer'}}>
                  <div style={{'display': 'flex', 'gap': '13px'}}>
                    <div style={{'width': '88px', 'borderRadius': '15px', 'background': v.grad, 'flex': 'none', 'position': 'relative'}}>
                      <span style={{'position': 'absolute', 'bottom': '6px', 'left': '6px', 'background': 'rgba(9,32,16,.6)', 'color': '#fff', 'fontSize': '9px', 'fontWeight': '700', 'padding': '2px 7px', 'borderRadius': '20px', 'backdropFilter': 'blur(4px)'}}>{v.type}</span>
                    </div>
                    <div style={{'flex': '1', 'minWidth': '0'}}>
                      <div style={{'display': 'flex', 'alignItems': 'flex-start', 'justifyContent': 'space-between', 'gap': '8px'}}>
                        <p style={{'margin': '0', 'fontSize': '15.5px', 'fontWeight': '800', 'color': '#16231a'}}>{v.name}</p>
                        <span style={v.statusStyle}>{v.status}</span>
                      </div>
                      <p style={{'margin': '3px 0 6px', 'fontSize': '12px', 'color': '#8a988c', 'fontWeight': '500'}}>{v.project} · {v.plot}</p>
                      <div style={{'display': 'flex', 'alignItems': 'center', 'gap': '6px', 'marginBottom': '4px'}}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8a988c" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/></svg>
                        <span style={{'fontSize': '11.5px', 'color': '#6d7d6f', 'fontWeight': '500'}}>{v.location}</span>
                      </div>
                      <div style={{'display': 'flex', 'alignItems': 'center', 'gap': '6px'}}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1a5e2e" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4"/></svg>
                        <span style={{'fontSize': '11.5px', 'color': '#3d4f40', 'fontWeight': '700'}}>{v.date} · {v.time}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between', 'marginTop': '12px', 'paddingTop': '11px', 'borderTop': '1px solid #f0f4ee'}}>
                    <span style={{'fontSize': '11px', 'color': '#9aa89c', 'fontWeight': '600'}}>Booking ID: {v.bookingId}</span>
                    <span style={{'fontSize': '12px', 'color': '#e2822a', 'fontWeight': '700'}}>View Details →</span>
                  </div>
                </div>
                {/* actions */}
                <div style={{'display': 'flex', 'gap': '8px', 'padding': '0 14px 14px'}}>
                  { v.actions.map((a, index) => (
                    <button onClick={a.go} style={a.style}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={a.stroke} stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d={a.icon}/></svg>
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>
      )}

      {/* ===================== VISIT DETAILS ===================== */}
      {isDetail && (
      <div className="rv-screen">
        <div style={{'position': '230px', 'background': sel.grad}}>
          <div style={{'position': 'absolute', 'inset': '0', 'background': 'linear-gradient(180deg,rgba(9,32,16,.3),transparent 40%,rgba(9,32,16,.5))'}}></div>
          <div style={{'position': 'absolute', 'top': '52px', 'left': '20px', 'right': '20px', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between'}}>
            <button onClick={back} style={{'width': '40px', 'height': '40px', 'borderRadius': '13px', 'border': 'none', 'background': 'rgba(255,255,255,.92)', 'color': '#12351d', 'fontSize': '18px', 'cursor': 'pointer'}}>←</button>
            <span style={{'fontSize': '15px', 'fontWeight': '800', 'color': '#fff', 'textShadow': '0 1px 6px rgba(0,0,0,.4)'}}>Visit Details</span>
            <button onClick={share} style={{'width': '40px', 'height': '40px', 'borderRadius': '13px', 'border': 'none', 'background': 'rgba(255,255,255,.92)', 'cursor': 'pointer', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center'}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#12351d" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13"/></svg>
            </button>
          </div>
          <div style={{'position': 'absolute', 'bottom': '16px', 'left': '20px', 'display': 'flex', 'gap': '8px'}}>
            <span style={sel.statusStyleLg}>{sel.status}</span>
          </div>
          <div style={{'position': 'absolute', 'bottom': '16px', 'right': '20px', 'display': 'flex', 'gap': '5px'}}>
            <span style={{'width': '20px', 'height': '5px', 'borderRadius': '3px', 'background': '#fff'}}></span>
            <span style={{'width': '5px', 'height': '5px', 'borderRadius': '3px', 'background': 'rgba(255,255,255,.6)'}}></span>
            <span style={{'width': '5px', 'height': '5px', 'borderRadius': '3px', 'background': 'rgba(255,255,255,.6)'}}></span>
          </div>
        </div>

        <div style={{'padding': '20px 22px 0', 'marginTop': '-24px', 'background': '#f8fbf6', 'borderRadius': '24px 24px 0 0', 'position': 'relative'}}>
          {/* countdown */}
          {sel.showCountdown && (
          <div style={{'display': 'center', 'gap': '9px', 'background': sel.cdBg, 'borderRadius': '14px', 'padding': '12px'}} 14px;margin-bottom:16px>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={sel.cdColor} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M12 7v5l3 2"/></svg>
            <span style={font}-size:13px;font-weight:700;color:sel.cdColor>{sel.countdown}</span>
          </div>
          )}

          {/* property info */}
          <p style={{'margin': '0 0 10px', 'fontSize': '12px', 'fontWeight': '800', 'color': '#8a988c', 'letterSpacing': '.5px', 'textTransform': 'uppercase'}}>Property Information</p>
          <p style={{'margin': '0', 'fontSize': '21px', 'fontWeight': '800', 'color': '#12351d'}}>{sel.name}</p>
          <p style={{'margin': '5px 0 0', 'fontSize': '13px', 'color': '#6d7d6f', 'fontWeight': '500'}}>{sel.project}</p>
          <div style={{'display': 'flex', 'alignItems': 'center', 'gap': '6px', 'marginTop': '8px'}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8a988c" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/></svg>
            <span style={{'fontSize': '12.5px', 'color': '#6d7d6f', 'fontWeight': '500'}}>{sel.location}</span>
          </div>
          <div style={{'display': 'grid', 'gridTemplateColumns': '1fr 1fr', 'gap': '11px', 'marginTop': '16px'}}>
            { propSpecs.map((p, index) => (
              <div style={{'background': '#fff', 'border': '1px solid #eef3ec', 'borderRadius': '14px', 'padding': '12px 14px'}}>
                <p style={{'margin': '0', 'fontSize': '11px', 'color': '#8a988c', 'fontWeight': '600'}}>{p.k}</p>
                <p style={{'margin': '5px'}} 0 0;font-size:14px;font-weight:700;color:p.color>{p.v}</p>
              </div>
            ))}
          </div>

          {/* visit info */}
          <p style={{'margin': '24px 0 12px', 'fontSize': '12px', 'fontWeight': '800', 'color': '#8a988c', 'letterSpacing': '.5px', 'textTransform': 'uppercase'}}>Visit Information</p>
          <div style={{'background': '#fff', 'border': '1px solid #eef3ec', 'borderRadius': '18px', 'padding': '6px 16px', 'boxShadow': '0 12px 30px -24px rgba(18,53,29,.5)'}}>
            { visitInfo.map((r, index) => (
              <div style={{'display': 'center', 'gap': '12px', 'padding': '13px'}} 0;border-top:r.border>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a5e2e" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d={r.icon}/></svg>
                <span style={{'flex': '1', 'fontSize': '12.5px', 'color': '#6d7d6f', 'fontWeight': '500'}}>{r.k}</span>
                <span style={{'fontSize': '13px', 'color': '#16231a', 'fontWeight': '700'}}>{r.v}</span>
              </div>
            ))}
          </div>

          {/* sales executive */}
          <div style={{'marginTop': '14px', 'background': '#fff', 'border': '1px solid #eef3ec', 'borderRadius': '18px', 'padding': '16px', 'display': 'flex', 'alignItems': 'center', 'gap': '13px', 'boxShadow': '0 12px 30px -24px rgba(18,53,29,.5)'}}>
            <div style={{'width': '50px', 'height': '50px', 'borderRadius': '15px', 'background': 'linear-gradient(160deg,#1a5e2e,#124423)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'fontSize': '17px', 'fontWeight': '800', 'color': '#fff'}}>RK</div>
            <div style={{'flex': '1'}}><p style={{'margin': '0', 'fontSize': '11px', 'color': '#8a988c', 'fontWeight': '600'}}>Sales Executive</p><p style={{'margin': '4px 0 0', 'fontSize': '14.5px', 'fontWeight': '800', 'color': '#16231a'}}>Rahul Kumar</p><p style={{'margin': '2px 0 0', 'fontSize': '11.5px', 'color': '#6d7d6f', 'fontWeight': '500'}}>+91 90000 12345</p></div>
            <button onClick={call} style={{'width': '44px', 'height': '44px', 'borderRadius': '13px', 'border': 'none', 'background': '#eef6ea', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'cursor': 'pointer'}}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#1a5e2e" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>
            </button>
          </div>

          {/* map / navigation */}
          <div style={{'marginTop': '14px', 'borderRadius': '18px', 'overflow': 'hidden', 'border': '1px solid #eef3ec', 'boxShadow': '0 12px 30px -24px rgba(18,53,29,.5)'}}>
            <div style={{'height': '120px', 'position': 'relative', 'background': 'linear-gradient(160deg,#eef6ea,#dce9d4)'}}>
              <div style={{'position': 'absolute', 'inset': '0', 'backgroundImage': 'linear-gradient(#cfe0c4 1px,transparent 1px),linear-gradient(90deg,#cfe0c4 1px,transparent 1px)', 'backgroundSize': '24px 24px', 'opacity': '.6'}}></div>
              <div style={{'position': 'absolute', 'top': '52px', 'left': '44%', 'width': '2px', 'height': '60px', 'background': '#c2a06a'}}></div>
              <div style={{'position': 'absolute', 'top': '20px', 'left': '20%', 'right': '30%', 'height': '2px', 'background': '#c2a06a', 'opacity': '.7'}}></div>
              <div style={{'position': 'absolute', 'top': '44px', 'left': 'calc(44% - 12px)', 'width': '26px', 'height': '26px', 'borderRadius': '50% 50% 50% 0', 'transform': 'rotate(-45deg)', 'background': '#e2822a', 'boxShadow': '0 4px 10px -2px rgba(226,130,42,.6)'}}></div>
            </div>
            <button onClick={directions} style={{'width': '100%', 'height': '50px', 'border': 'none', 'background': '#fff', 'color': '#1a5e2e', 'fontFamily': 'inherit', 'fontSize': '14px', 'fontWeight': '700', 'cursor': 'pointer', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'gap': '8px', 'borderTop': '1px solid #f0f4ee'}}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1a5e2e" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/></svg>
              Get Directions
            </button>
          </div>

          {/* quick actions */}
          <p style={{'margin': '24px 0 12px', 'fontSize': '12px', 'fontWeight': '800', 'color': '#8a988c', 'letterSpacing': '.5px', 'textTransform': 'uppercase'}}>Quick Actions</p>
          <div style={{'display': 'grid', 'gridTemplateColumns': '1fr 1fr', 'gap': '11px'}}>
            { quickActions.map((q, index) => (
              <button onClick={q.go} style={{'display': 'flex', 'alignItems': 'center', 'gap': '11px', 'background': '#fff', 'border': '1px solid #eef3ec', 'borderRadius': '15px', 'padding': '14px', 'cursor': 'pointer', 'fontFamily': 'inherit', 'textAlign': 'left'}}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#1a5e2e" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style={{'flex': 'none'}}><path d={q.icon}/></svg>
                <span style={{'fontSize': '12.5px', 'fontWeight': '700', 'color': '#16231a', 'lineHeight': '1.25'}}>{q.label}</span>
              </button>
            ))}
          </div>

          {/* primary actions */}
          {sel.isUpcoming && (
          <div style={{'display': 'flex', 'gap': '12px', 'margin': '20px 0'}}>
            <button onClick={goReschedule} style={{'flex': '1', 'height': '54px', 'borderRadius': '16px', 'border': '1.5px solid #1a5e2e', 'background': '#fff', 'color': '#1a5e2e', 'fontFamily': 'inherit', 'fontSize': '14px', 'fontWeight': '700', 'cursor': 'pointer'}}>Reschedule</button>
            <button onClick={askCancel} style={{'flex': '1', 'height': '54px', 'borderRadius': '16px', 'border': '1.5px solid #f3d3d0', 'background': '#fff', 'color': '#c0392b', 'fontFamily': 'inherit', 'fontSize': '14px', 'fontWeight': '700', 'cursor': 'pointer'}}>Cancel Visit</button>
          </div>
          )}
          {sel.isCompleted && (
          <div style={{'margin': '20px 0'}}>
            {sel.hasNotes && (
            <div style={{'background': '#fff', 'border': '1px solid #eef3ec', 'borderRadius': '16px', 'padding': '15px', 'marginBottom': '14px'}}>
              <p style={{'margin': '0 0 6px', 'fontSize': '12px', 'fontWeight': '800', 'color': '#8a988c', 'textTransform': 'uppercase', 'letterSpacing': '.5px'}}>Visit Notes</p>
              <p style={{'margin': '0', 'fontSize': '13px', 'color': '#4a5c4d', 'lineHeight': '1.55'}}>{sel.notes}</p>
            </div>
            )}
            <button onClick={goBook} style={{'width': '100%', 'height': '54px', 'borderRadius': '16px', 'border': 'none', 'background': 'linear-gradient(180deg,#eb9236,#e2822a)', 'color': '#fff', 'fontFamily': 'inherit', 'fontSize': '14.5px', 'fontWeight': '700', 'cursor': 'pointer', 'boxShadow': '0 12px 24px -12px rgba(226,130,42,.55)', 'marginBottom': '12px'}}>Book Another Visit</button>
            <div style={{'display': 'flex', 'gap': '12px'}}>
              <button style={{'flex': '1', 'height': '50px', 'borderRadius': '15px', 'border': '1.5px solid #cfe6c6', 'background': '#fff', 'color': '#1a5e2e', 'fontFamily': 'inherit', 'fontSize': '13.5px', 'fontWeight': '700', 'cursor': 'pointer'}}>♡ Mark Interested</button>
              <button style={{'flex': '1', 'height': '50px', 'borderRadius': '15px', 'border': '1.5px solid #cfe6c6', 'background': '#fff', 'color': '#1a5e2e', 'fontFamily': 'inherit', 'fontSize': '13.5px', 'fontWeight': '700', 'cursor': 'pointer'}}>Request Callback</button>
            </div>
          </div>
          )}
        </div>
      </div>
      )}

      {/* ===================== BOOK / RESCHEDULE ===================== */}
      {isBook && (
      <div className="rv-screen">
        <div style={{'background': 'linear-gradient(160deg,#1a5e2e 0%,#123f21 100%)', 'padding': '56px 22px 20px', 'borderRadius': '0 0 26px 26px', 'display': 'flex', 'alignItems': 'center', 'gap': '14px'}}>
          <button onClick={back} style={{'width': '38px', 'height': '38px', 'borderRadius': '12px', 'border': 'none', 'background': 'rgba(255,255,255,.14)', 'color': '#fff', 'fontSize': '18px', 'cursor': 'pointer'}}>←</button>
          <span style={{'fontSize': '18px', 'fontWeight': '800', 'color': '#fff'}}>{bookTitle}</span>
        </div>

        <div style={{'padding': '18px 22px 0'}}>
          <div style={{'display': 'flex', 'alignItems': 'center', 'gap': '12px', 'background': '#fff', 'border': '1px solid #eef3ec', 'borderRadius': '16px', 'padding': '12px', 'boxShadow': '0 12px 30px -24px rgba(18,53,29,.5)'}}>
            <div style={{'width': '52px', 'borderRadius': '13px', 'background': sel.grad, 'flex': 'none'}}></div>
            <div style={{'flex': '1'}}><p style={{'margin': '0', 'fontSize': '14.5px', 'fontWeight': '800', 'color': '#16231a'}}>{sel.name}</p><p style={{'margin': '3px 0 0', 'fontSize': '11.5px', 'color': '#8a988c', 'fontWeight': '500'}}>{sel.plot} · {sel.location}</p></div>
          </div>

          <p style={{'margin': '22px 0 12px', 'fontSize': '14px', 'fontWeight': '800', 'color': '#12351d'}}>Select Date · May 2025</p>
          <div style={{'display': 'grid', 'gridTemplateColumns': 'repeat(7,1fr)', 'gap': '6px'}}>
            { weekdays.map((w, index) => (<span style={{'textAlign': 'center', 'fontSize': '10.5px', 'fontWeight': '700', 'color': '#9aa89c'}}>{w}</span>))}
            { calendar.map((d, index) => (
              <button onClick={d.pick} style={d.style}>{d.label}</button>
            ))}
          </div>

          <p style={{'margin': '22px 0 12px', 'fontSize': '14px', 'fontWeight': '800', 'color': '#12351d'}}>Select Time Slot</p>
          <div style={{'display': 'grid', 'gridTemplateColumns': '1fr 1fr 1fr', 'gap': '9px'}}>
            { slots.map((s, index) => (
              <button onClick={s.pick} style={s.style}>{s.label}</button>
            ))}
          </div>

          <div style={{'marginTop': '20px', 'background': '#fff', 'border': '1px solid #eef3ec', 'borderRadius': '16px', 'padding': '16px', 'boxShadow': '0 12px 30px -24px rgba(18,53,29,.5)'}}>
            <p style={{'margin': '0 0 10px', 'fontSize': '12px', 'fontWeight': '800', 'color': '#8a988c', 'textTransform': 'uppercase', 'letterSpacing': '.5px'}}>Your Details</p>
            <div style={{'display': 'flex', 'justifyContent': 'space-between', 'padding': '6px 0'}}><span style={{'fontSize': '12.5px', 'color': '#6d7d6f', 'fontWeight': '500'}}>Name</span><span style={{'fontSize': '13px', 'color': '#16231a', 'fontWeight': '700'}}>Sravani K</span></div>
            <div style={{'display': 'flex', 'justifyContent': 'space-between', 'padding': '6px 0'}}><span style={{'fontSize': '12.5px', 'color': '#6d7d6f', 'fontWeight': '500'}}>Mobile</span><span style={{'fontSize': '13px', 'color': '#16231a', 'fontWeight': '700'}}>+91 98765 43210</span></div>
          </div>

          <button onClick={confirmBook} style={{'margin': '20px 0', 'width': '100%', 'height': '56px', 'border': 'none', 'borderRadius': '16px', 'background': 'linear-gradient(180deg,#1a5e2e,#124423)', 'color': '#fff', 'fontFamily': 'inherit', 'fontSize': '15px', 'fontWeight': '700', 'cursor': 'pointer', 'boxShadow': '0 14px 26px -12px rgba(18,68,35,.7)'}}>{confirmLabel} · {pickedDate} May, {pickedTime}</button>
        </div>
      </div>
      )}

      {/* ===================== SUCCESS ===================== */}
      {isSuccess && (
      <div className="rv-screen" style={{'minHeight': '820px', 'display': 'flex', 'flexDirection': 'column', 'alignItems': 'center', 'justifyContent': 'center', 'textAlign': 'center', 'padding': '40px 34px'}}>
        <div style={{'position': 'relative', 'width': '110px', 'height': '110px', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center'}}>
          <span style={{'position': 'absolute', 'inset': '0', 'borderRadius': '50%', 'background': '#1a5e2e', 'animation': 'rvRing 1.6s ease-out infinite'}}></span>
          <div style={{'position': 'relative', 'width': '100px', 'height': '100px', 'borderRadius': '50%', 'background': 'linear-gradient(180deg,#1a5e2e,#124423)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'boxShadow': '0 18px 40px -14px rgba(18,68,35,.8)'}}>
            <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 4 10-10"/></svg>
          </div>
        </div>
        <p style={{'margin': '26px 0 8px', 'fontSize': '23px', 'fontWeight': '800', 'color': '#12351d'}}>Site Visit Confirmed!</p>
        <p style={{'margin': '0', 'fontSize': '14px', 'color': '#6d7d6f', 'lineHeight': '1.55', 'maxWidth': '270px'}}>We've scheduled your visit. Our sales executive will meet you at the site.</p>
        <div style={{'marginTop': '26px', 'width': '100%', 'background': '#fff', 'border': '1px solid #eef3ec', 'borderRadius': '18px', 'padding': '6px 18px', 'boxShadow': '0 14px 34px -24px rgba(18,53,29,.55)'}}>
          { successRows.map((r, index) => (
            <div style={{'display': 'space-between', 'alignItems': 'center', 'padding': '13px'}} 0;border-top:r.border><span style={{'fontSize': '12.5px', 'color': '#8a988c', 'fontWeight': '500'}}>{r.k}</span><span style={{'fontSize': '13.5px', 'color': '#16231a', 'fontWeight': '700'}}>{r.v}</span></div>
          ))}
        </div>
        <button onClick={goVisits} style={{'marginTop': '28px', 'width': '100%', 'height': '56px', 'border': 'none', 'borderRadius': '16px', 'background': 'linear-gradient(180deg,#1a5e2e,#124423)', 'color': '#fff', 'fontFamily': 'inherit', 'fontSize': '15px', 'fontWeight': '700', 'cursor': 'pointer', 'boxShadow': '0 14px 26px -12px rgba(18,68,35,.7)'}}>View My Visits</button>
        <button onClick={goVisits} style={{'marginTop': '12px', 'width': '100%', 'height': '56px', 'border': '1.5px solid #cfe6c6', 'borderRadius': '16px', 'background': '#fff', 'color': '#1a5e2e', 'fontFamily': 'inherit', 'fontSize': '15px', 'fontWeight': '700', 'cursor': 'pointer'}}>Back to Home</button>
      </div>
      )}

    </div>


    {/* ===================== MAIN NAV ===================== */}
    <nav className="rv-nav">
      <button className="rv-nav-btn" onClick={goHome}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5"/></svg>
        <span className="nav-label">Home</span>
      </button>
      <button className="rv-nav-btn active" onClick={goVisitsPage}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M9 14l2 2 4-4"/></svg>
        <span className="nav-label">Site Visits</span>
      </button>
      <button className="rv-nav-btn" onClick={goLandsPage}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 21V4h9v17M9 8h3M9 12h3M9 16h3M6 21h13"/></svg>
        <span className="nav-label">My Lands</span>
      </button>
      <button className="rv-nav-btn" onClick={goPayments}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h18v11H3zM3 10.5h18"/></svg>
        <span className="nav-label">Payments</span>
      </button>
      <button className="rv-nav-btn" onClick={goProfile}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M5 20c0-3.5 3-6 7-6s7 2.5 7 6"/></svg>
        <span className="nav-label">Profile</span>
      </button>
    </nav>


    {/* CANCEL MODAL */}
    {showCancel && (
    <div onClick={dismiss} style={{'position': 'absolute', 'inset': '0', 'background': 'rgba(9,32,16,.5)', 'backdropFilter': 'blur(3px)', 'display': 'flex', 'alignItems': 'flex-end', 'zIndex': '70'}}>
      <div style={{'background': '#fff', 'borderRadius': '26px 26px 0 0', 'padding': '28px 24px 26px', 'width': '100%', 'animation': 'rvPop .28s cubic-bezier(.22,1.2,.5,1) both'}}>
        <div style={{'width': '64px', 'height': '64px', 'borderRadius': '20px', 'background': '#fdecec', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'margin': '0 auto'}}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#c0392b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v5M12 16h.01M10.3 3.8 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0z"/></svg>
        </div>
        <p style={{'margin': '16px 0 6px', 'fontSize': '18px', 'fontWeight': '800', 'color': '#12351d', 'textAlign': 'center'}}>Cancel this visit?</p>
        <p style={{'margin': '0', 'fontSize': '13px', 'color': '#6d7d6f', 'textAlign': 'center', 'lineHeight': '1.55'}}>This will cancel your visit to {sel.name} on {sel.date}. You can rebook anytime.</p>
        <div style={{'display': 'flex', 'gap': '12px', 'marginTop': '22px'}}>
          <button onClick={dismiss} style={{'flex': '1', 'height': '52px', 'borderRadius': '15px', 'border': '1.5px solid #e2e8e0', 'background': '#fff', 'color': '#3d4f40', 'fontFamily': 'inherit', 'fontSize': '14.5px', 'fontWeight': '700', 'cursor': 'pointer'}}>Keep Visit</button>
          <button onClick={dismiss} style={{'flex': '1', 'height': '52px', 'borderRadius': '15px', 'border': 'none', 'background': '#c0392b', 'color': '#fff', 'fontFamily': 'inherit', 'fontSize': '14.5px', 'fontWeight': '700', 'cursor': 'pointer'}}>Cancel Visit</button>
        </div>
      </div>
    </div>
    )}

  </div>

  
