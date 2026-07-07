

  <div className="rv-phone">
    <div style={{'position': 'absolute', 'top': '0', 'left': '50%', 'transform': 'translateX(-50%)', 'width': '150px', 'height': '30px', 'background': '#0c2615', 'borderRadius': '0 0 20px 20px', 'zIndex': '60'}}></div>
    <div style={{'position': '0', 'left': '0', 'right': '0', 'height': '50px', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between', 'padding': '0'}} 28px;font-size:13.5px;font-weight:700;color:statusColor;z-index:50;pointer-events:none>
      <span>9:41</span><span style={{'fontSize': '11px', 'letterSpacing': '1px'}}>▟▟▟ 100%</span>
    </div>

    <div className="rv-scroll" style={{'position': 'absolute', 'inset': '0', 'overflowY': 'auto'}}>

      {/* ===================== HOME ===================== */}
      {isHome && (
      <div className="rv-screen">
        <div style={{'background': 'linear-gradient(160deg,#1a5e2e 0%,#123f21 100%)', 'padding': '58px 22px 22px', 'borderRadius': '0 0 26px 26px'}}>
          <div style={{'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between'}}>
            <div>
              <p style={{'margin': '0', 'fontSize': '19px', 'fontWeight': '800', 'color': '#fff'}}>Hello, {userName} 👋</p>
              <p style={{'margin': '4px 0 0', 'fontSize': '13px', 'color': '#bcd6bd', 'fontWeight': '500'}}>Let's find your dream property</p>
            </div>
            <img src="assets/logo-mark-white.png" alt="Rivan" style={{'height': '34px', 'width': 'auto', 'opacity': '.95'}} />
          </div>
          <div style={{'marginTop': '18px', 'display': 'flex', 'alignItems': 'center', 'gap': '10px', 'height': '50px', 'background': '#fff', 'borderRadius': '15px', 'padding': '0 14px'}}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#7c8c7e" stroke-width="1.8" stroke-linecap="round"><path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14M20 20l-3.5-3.5"/></svg>
            <input placeholder="Search by location, project or plot no." style={{'flex': '1', 'border': 'none', 'background': 'transparent', 'fontFamily': 'inherit', 'fontSize': '13.5px', 'fontWeight': '500', 'color': '#16231a'}}/>
            <div style={{'width': '34px', 'height': '34px', 'borderRadius': '10px', 'background': '#eef6ea', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center'}}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1a5e2e" stroke-width="1.8" stroke-linecap="round"><path d="M4 6h16M7 12h10M10 18h4"/></svg>
            </div>
          </div>
        </div>

        <div style={{'padding': '20px 22px 0'}}>
          {/* hero banner */}
          <div onClick={openFirstProject} style={{'position': 'relative', 'height': '172px', 'borderRadius': '22px', 'overflow': 'hidden', 'cursor': 'pointer', 'background': 'linear-gradient(150deg,#2f6b3a 0%,#6ba15a 52%,#c7dc9c 100%)', 'boxShadow': '0 16px 34px -18px rgba(18,53,29,.6)'}}>
            <div style={{'position': 'absolute', 'inset': '0', 'background': 'radial-gradient(80% 60% at 78% 22%,rgba(255,247,214,.55),transparent 60%),linear-gradient(180deg,rgba(9,32,16,.05),rgba(9,32,16,.55))'}}></div>
            <div style={{'position': 'absolute', 'inset': '0', 'padding': '20px', 'display': 'flex', 'flexDirection': 'column', 'justifyContent': 'space-between'}}>
              <div>
                <p style={{'margin': '0', 'fontSize': '19px', 'fontWeight': '800', 'color': '#fff'}}>Emerald Estate</p>
                <p style={{'margin': '3px 0 0', 'fontSize': '12.5px', 'color': '#eaf3e4', 'fontWeight': '500'}}>Premium Villa Plots</p>
              </div>
              <span style={{'alignSelf': 'flex-start', 'background': '#fff', 'color': '#12351d', 'fontSize': '12.5px', 'fontWeight': '700', 'padding': '9px 16px', 'borderRadius': '11px'}}>Explore Now →</span>
            </div>
          </div>

          {/* featured */}
          <div style={{'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between', 'margin': '24px 0 12px'}}>
            <span style={{'fontSize': '16px', 'fontWeight': '800', 'color': '#12351d'}}>Featured Projects</span>
            <a onClick={goExplore} style={{'fontSize': '13px', 'fontWeight': '700', 'color': '#e2822a', 'cursor': 'pointer'}}>View All</a>
          </div>
          <div style={{'display': 'grid', 'gridTemplateColumns': '1fr 1fr', 'gap': '13px'}}>
            { featured.map((f, index) => (
              <div onClick={f.open} style={{'background': '#fff', 'borderRadius': '18px', 'overflow': 'hidden', 'border': '1px solid #eef3ec', 'boxShadow': '0 10px 28px -20px rgba(18,53,29,.5)', 'cursor': 'pointer'}}>
                <div style={{height: '96px', background: f.grad, position: 'relative'}}>
                  <span style={{'position': 'absolute', 'top': '8px', 'left': '8px', 'background': 'rgba(9,32,16,.55)', 'color': '#fff', 'fontSize': '10px', 'fontWeight': '700', 'padding': '3px 8px', 'borderRadius': '20px', 'backdropFilter': 'blur(4px)'}}>📍 {f.tag}</span>
                </div>
                <div style={{'padding': '11px 12px 13px'}}>
                  <p style={{'margin': '0', 'fontSize': '13.5px', 'fontWeight': '700', 'color': '#16231a'}}>{f.name}</p>
                  <p style={{'margin': '3px 0 8px', 'fontSize': '11.5px', 'color': '#8a988c', 'fontWeight': '500'}}>{f.loc}</p>
                  <p style={{'margin': '0', 'fontSize': '14px', 'fontWeight': '800', 'color': '#1a5e2e'}}>{f.price} <span style={{'fontSize': '10.5px', 'color': '#9aa89c', 'fontWeight': '600'}}>/sq.yd</span></p>
                </div>
              </div>
            ))}
          </div>

          {/* quick actions */}
          <p style={{'fontSize': '16px', 'fontWeight': '800', 'color': '#12351d', 'margin': '24px 0 13px'}}>Quick Actions</p>
          <div style={{'display': 'grid', 'gridTemplateColumns': 'repeat(5,1fr)', 'gap': '8px'}}>
            { quickActions.map((q, index) => (
              <button onClick={q.go} style={{'border': 'none', 'background': 'transparent', 'cursor': 'pointer', 'display': 'flex', 'flexDirection': 'column', 'alignItems': 'center', 'gap': '7px', 'fontFamily': 'inherit'}}>
                <span style={{'width': '50px', 'height': '50px', 'borderRadius': '16px', 'background': '#eef6ea', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center'}}>
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#1a5e2e" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d={q.icon}/></svg>
                </span>
                <span style={{'fontSize': '10px', 'fontWeight': '600', 'color': '#4a5c4d', 'textAlign': 'center', 'lineHeight': '1.2'}}>{q.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* ===================== EXPLORE ===================== */}
      {isExplore && (
      <div className="rv-screen">
        <div style={{'background': 'linear-gradient(160deg,#1a5e2e 0%,#123f21 100%)', 'padding': '58px 22px 20px', 'borderRadius': '0 0 26px 26px'}}>
          <div style={{'display': 'flex', 'alignItems': 'center', 'gap': '14px'}}>
            <button onClick={goHome} style={{'width': '38px', 'height': '38px', 'borderRadius': '12px', 'border': 'none', 'background': 'rgba(255,255,255,.14)', 'color': '#fff', 'fontSize': '18px', 'cursor': 'pointer'}}>←</button>
            <span style={{'fontSize': '18px', 'fontWeight': '800', 'color': '#fff'}}>Explore Properties</span>
          </div>
          <div style={{'marginTop': '16px', 'display': 'flex', 'alignItems': 'center', 'gap': '10px', 'height': '48px', 'background': '#fff', 'borderRadius': '15px', 'padding': '0 14px'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c8c7e" stroke-width="1.8" stroke-linecap="round"><path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14M20 20l-3.5-3.5"/></svg>
            <input placeholder="Search location or project" style={{'flex': '1', 'border': 'none', 'background': 'transparent', 'fontFamily': 'inherit', 'fontSize': '13.5px', 'fontWeight': '500', 'color': '#16231a'}}/>
          </div>
        </div>

        <div style={{'padding': '18px 22px 0'}}>
          <div style={{'display': 'flex', 'gap': '9px', 'overflowX': 'auto'}} className="rv-scroll">
            { chips.map((c, index) => (
              <button onClick={c.pick} style={c.style}>{c.label}</button>
            ))}
          </div>

          <div style={{'display': 'flex', 'justifyContent': 'space-between', 'margin': '18px 2px 6px'}}>
            { filterIcons.map((fi, index) => (
              <div style={{'display': 'flex', 'flexDirection': 'column', 'alignItems': 'center', 'gap': '6px'}}>
                <span style={{'width': '44px', 'height': '44px', 'borderRadius': '14px', 'border': '1px solid #e6ede2', 'background': '#fff', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center'}}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#1a5e2e" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d={fi.icon}/></svg>
                </span>
                <span style={{'fontSize': '10.5px', 'fontWeight': '600', 'color': '#6d7d6f'}}>{fi.label}</span>
              </div>
            ))}
          </div>

          <div style={{'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between', 'margin': '18px 0 12px'}}>
            <span style={{'fontSize': '15px', 'fontWeight': '800', 'color': '#12351d'}}>Projects Near You</span>
            <a onClick={refreshExplore} style={{'fontSize': '12.5px', 'fontWeight': '700', 'color': '#e2822a', 'cursor': 'pointer'}}>↻ Refresh</a>
          </div>

          {/* loading skeletons */}
          {exploreLoading && (
          <div style={{'display': 'flex', 'flexDirection': 'column', 'gap': '12px'}}>
            { skeletons.map((s, index) => (
              <div style={{'display': 'flex', 'gap': '12px', 'background': '#fff', 'borderRadius': '16px', 'padding': '12px', 'border': '1px solid #eef3ec'}}>
                <div className="rv-skel" style={{'width': '78px', 'height': '78px', 'borderRadius': '12px'}}></div>
                <div style={{'flex': '1', 'display': 'flex', 'flexDirection': 'column', 'gap': '8px', 'justifyContent': 'center'}}>
                  <div className="rv-skel" style={{'height': '13px', 'width': '65%', 'borderRadius': '6px'}}></div>
                  <div className="rv-skel" style={{'height': '11px', 'width': '45%', 'borderRadius': '6px'}}></div>
                  <div className="rv-skel" style={{'height': '13px', 'width': '35%', 'borderRadius': '6px'}}></div>
                </div>
              </div>
            ))}
          </div>
          )}

          {/* list */}
          {exploreReady && (
          <div style={{'display': 'flex', 'flexDirection': 'column', 'gap': '12px'}}>
            { nearby.map((n, index) => (
              <div onClick={n.open} style={{'display': 'flex', 'gap': '13px', 'background': '#fff', 'borderRadius': '16px', 'padding': '12px', 'border': '1px solid #eef3ec', 'boxShadow': '0 10px 28px -22px rgba(18,53,29,.5)', 'cursor': 'pointer'}}>
                <div style={{'width': '82px', 'borderRadius': '13px', 'background': n.grad, 'flex': 'none'}}></div>
                <div style={{'flex': '1', 'display': 'flex', 'flexDirection': 'column', 'justifyContent': 'center'}}>
                  <p style={{'margin': '0', 'fontSize': '14.5px', 'fontWeight': '700', 'color': '#16231a'}}>{n.name}</p>
                  <p style={{'margin': '3px 0 8px', 'fontSize': '12px', 'color': '#8a988c', 'fontWeight': '500'}}>{n.loc}</p>
                  <p style={{'margin': '0', 'fontSize': '14.5px', 'fontWeight': '800', 'color': '#1a5e2e'}}>{n.price} <span style={{'fontSize': '11px', 'color': '#9aa89c', 'fontWeight': '600'}}>/sq.yd</span></p>
                </div>
                <button onClick={n.like} style={{'alignSelf': 'flex-start', 'border': 'none', 'background': 'transparent', 'cursor': 'pointer', 'padding': '2px'}}>
                  <svg width="21" height="21" viewBox="0 0 24 24" fill={n.heartFill} stroke={n.heartStroke} stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.5-7-9.5A3.5 3.5 0 0 1 12 8a3.5 3.5 0 0 1 7 2.5c0 5-7 9.5-7 9.5z"/></svg>
                </button>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>
      )}

      {/* ===================== MY PROPERTIES ===================== */}
      {isProps && (
      <div className="rv-screen">
        <div style={{'background': 'linear-gradient(160deg,#1a5e2e 0%,#123f21 100%)', 'padding': '58px 22px 22px', 'borderRadius': '0 0 26px 26px'}}>
          <p style={{'margin': '0 0 16px', 'fontSize': '19px', 'fontWeight': '800', 'color': '#fff'}}>My Properties</p>
          <div style={{'display': 'flex', 'gap': '12px'}}>
            <div style={{'flex': '1', 'background': 'rgba(255,255,255,.1)', 'border': '1px solid rgba(255,255,255,.16)', 'borderRadius': '16px', 'padding': '14px'}}>
              <p style={{'margin': '0', 'fontSize': '11.5px', 'color': '#bcd6bd', 'fontWeight': '600'}}>Total Properties</p>
              <p style={{'margin': '6px 0 0', 'fontSize': '22px', 'fontWeight': '800', 'color': '#fff'}}>2</p>
            </div>
            <div style={{'flex': '1', 'background': 'rgba(255,255,255,.1)', 'border': '1px solid rgba(255,255,255,.16)', 'borderRadius': '16px', 'padding': '14px'}}>
              <p style={{'margin': '0', 'fontSize': '11.5px', 'color': '#bcd6bd', 'fontWeight': '600'}}>Total Investment</p>
              <p style={{'margin': '6px 0 0', 'fontSize': '22px', 'fontWeight': '800', 'color': '#fff'}}>₹18,00,000</p>
            </div>
          </div>
        </div>

        <div style={{'padding': '18px 22px 0'}}>
          <div style={{'display': 'flex', 'background': '#eef3ec', 'borderRadius': '14px', 'padding': '5px', 'gap': '5px'}}>
            { myTabs.map((t, index) => (
              <button onClick={t.pick} style={t.style}>{t.label}</button>
            ))}
          </div>

          {myEmpty && (
          <div style={{'display': 'flex', 'flexDirection': 'column', 'alignItems': 'center', 'textAlign': 'center', 'padding': '56px 20px'}}>
            <div style={{'width': '82px', 'height': '82px', 'borderRadius': '26px', 'background': '#eef6ea', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center'}}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#8fae8c" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 21V4h9v17M9 8h3M9 12h3M9 16h3M6 21h13"/></svg>
            </div>
            <p style={{'margin': '20px 0 6px', 'fontSize': '16px', 'fontWeight': '800', 'color': '#12351d'}}>No completed properties yet</p>
            <p style={{'margin': '0', 'fontSize': '13px', 'color': '#8a988c', 'maxWidth': '220px', 'lineHeight': '1.5'}}>Your fully-paid properties will appear here once the payments are complete.</p>
          </div>
          )}

          {myHasList && (
          <div style={{'display': 'flex', 'flexDirection': 'column', 'gap': '14px', 'marginTop': '16px'}}>
            { myProps.map((m, index) => (
              <div onClick={m.open} style={{'background': '#fff', 'borderRadius': '20px', 'padding': '14px', 'border': '1px solid #eef3ec', 'boxShadow': '0 12px 30px -22px rgba(18,53,29,.5)', 'cursor': 'pointer'}}>
                <div style={{'display': 'flex', 'gap': '13px'}}>
                  <div style={{'width': '88px', 'borderRadius': '14px', 'background': m.grad, 'flex': 'none'}}></div>
                  <div style={{'flex': '1'}}>
                    <p style={{'margin': '0', 'fontSize': '15px', 'fontWeight': '800', 'color': '#16231a'}}>{m.name}</p>
                    <p style={{'margin': '3px 0 6px', 'fontSize': '13px', 'fontWeight': '700', 'color': '#3d4f40'}}>{m.plot}</p>
                    <p style={{'margin': '0', 'fontSize': '11.5px', 'color': '#8a988c', 'fontWeight': '500'}}>{m.spec}</p>
                    <p style={{'margin': '3px 0 0', 'fontSize': '11.5px', 'color': '#8a988c', 'fontWeight': '500'}}>Purchased on {m.date}</p>
                  </div>
                </div>
                <div style={{'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between', 'margin': '14px 0 7px'}}>
                  <span style={{'fontSize': '12px', 'fontWeight': '600', 'color': '#6d7d6f'}}>Payment Progress</span>
                  <span style={{'fontSize': '11px', 'fontWeight': '700', 'color': '#1a5e2e', 'background': '#e8f3e3', 'padding': '4px 11px', 'borderRadius': '20px'}}>{m.status}</span>
                </div>
                <div style={{'display': 'flex', 'alignItems': 'center', 'gap': '10px'}}>
                  <div style={{'flex': '1', 'height': '8px', 'borderRadius': '5px', 'background': '#eef3ec', 'overflow': 'hidden'}}>
                    <div style={{'height': '5px', 'background': 'linear-gradient(90deg,#1a5e2e,#2f8544)', 'width': m.width}}></div>
                  </div>
                  <span style={{'fontSize': '14px', 'fontWeight': '800', 'color': '#1a5e2e'}}>{m.pct}</span>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>
      )}


      {/* ===================== PAYMENTS ===================== */}
      {isPayments && (
      <div className="rv-screen">
        <div style={{'background': 'linear-gradient(160deg,#1a5e2e 0%,#123f21 100%)', 'padding': '58px 22px 24px', 'borderRadius': '0 0 26px 26px'}}>
          <div style={{'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between'}}>
            <div style={{'display': 'flex', 'alignItems': 'center', 'gap': '14px'}}>
              <button onClick={goHome} style={{'width': '38px', 'height': '38px', 'borderRadius': '12px', 'border': 'none', 'background': 'rgba(255,255,255,.14)', 'color': '#fff', 'fontSize': '18px', 'cursor': 'pointer'}}>←</button>
              <span style={{'fontSize': '18px', 'fontWeight': '800', 'color': '#fff'}}>Payments Overview</span>
            </div>
            <button onClick={goNotif} style={{'width': '38px', 'height': '38px', 'borderRadius': '12px', 'border': 'none', 'background': 'rgba(255,255,255,.14)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'cursor': 'pointer'}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 20a2 2 0 0 0 4 0"/></svg>
            </button>
          </div>
          {/* Summary: 3 percentage stat boxes */}
          <div style={{'marginTop': '18px', 'display': 'grid', 'gridTemplateColumns': '1fr 1fr 1fr', 'gap': '10px'}}>
            <div style={{'background': 'rgba(255,255,255,.1)', 'border': '1px solid rgba(255,255,255,.16)', 'borderRadius': '16px', 'padding': '14px', 'textAlign': 'center'}}>
              <p style={{'margin': '0', 'fontSize': '10px', 'color': '#bcd6bd', 'fontWeight': '600', 'textTransform': 'uppercase', 'letterSpacing': '.4px'}}>Paid</p>
              <p style={{'margin': '8px 0 0', 'fontSize': '24px', 'fontWeight': '800', 'color': '#fff'}}>70%</p>
              <p style={{'margin': '4px 0 0', 'fontSize': '10px', 'color': '#8db991', 'fontWeight': '500'}}>of total</p>
            </div>
            <div style={{'background': 'rgba(255,255,255,.1)', 'border': '1px solid rgba(255,255,255,.16)', 'borderRadius': '16px', 'padding': '14px', 'textAlign': 'center'}}>
              <p style={{'margin': '0', 'fontSize': '10px', 'color': '#bcd6bd', 'fontWeight': '600', 'textTransform': 'uppercase', 'letterSpacing': '.4px'}}>Remaining</p>
              <p style={{'margin': '8px 0 0', 'fontSize': '24px', 'fontWeight': '800', 'color': '#eb9236'}}>30%</p>
              <p style={{'margin': '4px 0 0', 'fontSize': '10px', 'color': '#8db991', 'fontWeight': '500'}}>of total</p>
            </div>
            <div style={{'background': 'rgba(255,255,255,.1)', 'border': '1px solid rgba(255,255,255,.16)', 'borderRadius': '16px', 'padding': '14px', 'textAlign': 'center'}}>
              <p style={{'margin': '0', 'fontSize': '10px', 'color': '#bcd6bd', 'fontWeight': '600', 'textTransform': 'uppercase', 'letterSpacing': '.4px'}}>Properties</p>
              <p style={{'margin': '8px 0 0', 'fontSize': '24px', 'fontWeight': '800', 'color': '#fff'}}>2</p>
              <p style={{'margin': '4px 0 0', 'fontSize': '10px', 'color': '#8db991', 'fontWeight': '500'}}>plots</p>
            </div>
          </div>
        </div>

        <div style={{'padding': '20px 22px 0'}}>
          {/* Payment progress card: percentage only */}
          <div style={{'background': '#fff', 'borderRadius': '20px', 'padding': '18px', 'border': '1px solid #eef3ec', 'boxShadow': '0 12px 30px -24px rgba(18,53,29,.5)'}}>
            <div style={{'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'center', 'marginBottom': '14px'}}>
              <div>
                <p style={{'margin': '0', 'fontSize': '12px', 'color': '#8a988c', 'fontWeight': '600'}}>Paid So Far</p>
                <p style={{'margin': '6px 0 0', 'fontSize': '28px', 'fontWeight': '800', 'color': '#1a5e2e'}}>70%</p>
              </div>
              <div style={{'textAlign': 'right'}}>
                <p style={{'margin': '0', 'fontSize': '12px', 'color': '#8a988c', 'fontWeight': '600'}}>Balance Due</p>
                <p style={{'margin': '6px 0 0', 'fontSize': '28px', 'fontWeight': '800', 'color': '#e2822a'}}>30%</p>
              </div>
            </div>
            {/* Segmented progress bar */}
            <div style={{'height': '10px', 'borderRadius': '6px', 'background': '#eef3ec', 'overflow': 'hidden', 'display': 'flex'}}>
              <div style={{'height': '100%', 'width': '70%', 'background': 'linear-gradient(90deg,#1a5e2e,#2f8544)', 'borderRadius': '6px 0 0 6px'}}></div>
              <div style={{'height': '100%', 'width': '30%', 'background': 'linear-gradient(90deg,#eb9236,#e2822a)', 'borderRadius': '0 6px 6px 0'}}></div>
            </div>
            <div style={{'display': 'flex', 'justifyContent': 'space-between', 'marginTop': '10px'}}>
              <span style={{'fontSize': '11px', 'color': '#1a5e2e', 'fontWeight': '700'}}>● Paid: 70%</span>
              <span style={{'fontSize': '11px', 'color': '#e2822a', 'fontWeight': '700'}}>● Remaining: 30%</span>
            </div>
            {/* Milestone markers */}
            <div style={{'marginTop': '14px', 'display': 'grid', 'gridTemplateColumns': 'repeat(4,1fr)', 'gap': '8px'}}>
              <div style={{'textAlign': 'center', 'padding': '10px 6px', 'borderRadius': '12px', 'background': '#e8f3e3', 'border': '1px solid #cfe6c6'}}>
                <p style={{'margin': '0', 'fontSize': '13px', 'fontWeight': '800', 'color': '#1a5e2e'}}>10%</p>
                <p style={{'margin': '3px 0 0', 'fontSize': '9.5px', 'color': '#4a6b4a', 'fontWeight': '600'}}>Token</p>
                <p style={{'margin': '3px 0 0', 'fontSize': '9px', 'color': '#1a5e2e', 'fontWeight': '700'}}>✓ Done</p>
              </div>
              <div style={{'textAlign': 'center', 'padding': '10px 6px', 'borderRadius': '12px', 'background': '#e8f3e3', 'border': '1px solid #cfe6c6'}}>
                <p style={{'margin': '0', 'fontSize': '13px', 'fontWeight': '800', 'color': '#1a5e2e'}}>20%</p>
                <p style={{'margin': '3px 0 0', 'fontSize': '9.5px', 'color': '#4a6b4a', 'fontWeight': '600'}}>Booking</p>
                <p style={{'margin': '3px 0 0', 'fontSize': '9px', 'color': '#1a5e2e', 'fontWeight': '700'}}>✓ Done</p>
              </div>
              <div style={{'textAlign': 'center', 'padding': '10px 6px', 'borderRadius': '12px', 'background': '#e8f3e3', 'border': '1px solid #cfe6c6'}}>
                <p style={{'margin': '0', 'fontSize': '13px', 'fontWeight': '800', 'color': '#1a5e2e'}}>40%</p>
                <p style={{'margin': '3px 0 0', 'fontSize': '9.5px', 'color': '#4a6b4a', 'fontWeight': '600'}}>Milestone 1</p>
                <p style={{'margin': '3px 0 0', 'fontSize': '9px', 'color': '#1a5e2e', 'fontWeight': '700'}}>✓ Done</p>
              </div>
              <div style={{'textAlign': 'center', 'padding': '10px 6px', 'borderRadius': '12px', 'background': '#fff8f0', 'border': '1px solid #f5d9b4'}}>
                <p style={{'margin': '0', 'fontSize': '13px', 'fontWeight': '800', 'color': '#e2822a'}}>70%</p>
                <p style={{'margin': '3px 0 0', 'fontSize': '9.5px', 'color': '#a06020', 'fontWeight': '600'}}>Milestone 2</p>
                <p style={{'margin': '3px 0 0', 'fontSize': '9px', 'color': '#e2822a', 'fontWeight': '700'}}>Upcoming</p>
              </div>
            </div>
          </div>

          {/* Next instalment: percentage-based */}
          <div style={{'marginTop': '14px', 'background': '#fff', 'borderRadius': '20px', 'padding': '18px', 'border': '1px solid #eef3ec', 'boxShadow': '0 12px 30px -24px rgba(18,53,29,.5)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between'}}>
            <div>
              <p style={{'margin': '0', 'fontSize': '12px', 'color': '#8a988c', 'fontWeight': '600'}}>Next Instalment</p>
              <div style={{'display': 'flex', 'alignItems': 'baseline', 'gap': '6px', 'marginTop': '6px'}}>
                <span style={{'fontSize': '26px', 'fontWeight': '800', 'color': '#16231a'}}>5%</span>
                <span style={{'fontSize': '12px', 'color': '#9aa89c', 'fontWeight': '600'}}>of total value</span>
              </div>
              <p style={{'margin': '5px 0 0', 'fontSize': '11.5px', 'color': '#e2822a', 'fontWeight': '700'}}>Due on 12 Jun 2025</p>
            </div>
            <button onClick={payNow} style={{'border': 'none', 'borderRadius': '14px', 'background': 'linear-gradient(180deg,#1a5e2e,#124423)', 'color': '#fff', 'fontFamily': 'inherit', 'fontSize': '14px', 'fontWeight': '700', 'padding': '13px 22px', 'cursor': 'pointer', 'boxShadow': '0 12px 22px -10px rgba(18,68,35,.7)'}}>Pay Now</button>
          </div>

          <div style={{'marginTop': '14px', 'background': '#fff', 'borderRadius': '20px', 'border': '1px solid #eef3ec', 'overflow': 'hidden', 'boxShadow': '0 12px 30px -24px rgba(18,53,29,.5)'}}>
            { payLinks.map((p, index) => (
              <button onClick={p.go} style={{'width': 'flex', 'alignItems': 'center', 'gap': '13px', 'padding': '16px'}} 18px;border:none;background:transparent;cursor:pointer;font-family:inherit;border-top:p.border>
                <span style={{'width': '38px', 'height': '38px', 'borderRadius': '11px', 'background': '#eef6ea', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'flex': 'none'}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a5e2e" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d={p.icon}/></svg>
                </span>
                <span style={{'flex': '1', 'textAlign': 'left', 'fontSize': '14px', 'fontWeight': '600', 'color': '#16231a'}}>{p.label}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c2cdc0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>
              </button>
            ))}
          </div>
        </div>
      </div>
      )}


      {/* ===================== PROFILE ===================== */}
      {isProfile && (
      <div className="rv-screen">
        <div style={{'background': 'linear-gradient(160deg,#1a5e2e 0%,#123f21 100%)', 'padding': '56px 22px 24px', 'borderRadius': '0 0 26px 26px'}}>
          <div style={{'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between'}}>
            <span style={{'fontSize': '18px', 'fontWeight': '800', 'color': '#fff'}}>Profile</span>
            <img src="assets/logo-mark-white.png" alt="Rivan" style={{'height': '30px', 'opacity': '.9'}} />
          </div>
          <div style={{'marginTop': '18px', 'display': 'flex', 'alignItems': 'center', 'gap': '14px'}}>
            <div style={{'width': '62px', 'height': '62px', 'borderRadius': '20px', 'background': 'rgba(255,255,255,.16)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'fontSize': '24px', 'fontWeight': '800', 'color': '#fff'}}>{initials}</div>
            <div>
              <p style={{'margin': '0', 'fontSize': '17px', 'fontWeight': '800', 'color': '#fff'}}>{userName} K</p>
              <p style={{'margin': '4px 0 0', 'fontSize': '12.5px', 'color': '#bcd6bd', 'fontWeight': '500'}}>+91 98765 43210</p>
              <p style={{'margin': '2px 0 0', 'fontSize': '12.5px', 'color': '#bcd6bd', 'fontWeight': '500'}}>sravani@gmail.com</p>
            </div>
          </div>
        </div>

        <div style={{'padding': '16px 22px 0'}}>
          <div style={{'background': '#fff', 'borderRadius': '20px', 'border': '1px solid #eef3ec', 'overflow': 'hidden', 'boxShadow': '0 12px 30px -24px rgba(18,53,29,.5)'}}>
            { profileMenu.map((i, index) => (
              <button onClick={i.go} style={{'width': 'flex', 'alignItems': 'center', 'gap': '14px', 'padding': '15px'}} 18px;border:none;background:transparent;cursor:pointer;font-family:inherit;border-top:i.border>
                <span style={{'width': '38px', 'borderRadius': '11px', 'background': i.iconBg, 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'flex': 'none'}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={i.iconColor} stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d={i.icon}/></svg>
                </span>
                <span style={{'flex': 'left', 'fontSize': '14.5px', 'fontWeight': '600', 'color': i.textColor}}>{i.label}</span>
                {i.badge && (<span style={{'fontSize': '11px', 'fontWeight': '700', 'color': '#1a5e2e', 'background': '#e8f3e3', 'padding': '4px 10px', 'borderRadius': '20px', 'marginRight': '6px'}}>✓ {i.badgeText}</span>)}
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#c2cdc0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>
              </button>
            ))}
          </div>
          <p style={{'textAlign': 'center', 'margin': '18px 0 0', 'fontSize': '11.5px', 'color': '#9aa89c', 'fontWeight': '600'}}>Rivan Reality • v1.0.0</p>
        </div>
      </div>
      )}

      {/* ===================== PROPERTY DETAILS ===================== */}
      {isPropDetail && (
      <div className="rv-screen">
        <div style={{'position': '300px', 'background': sel.grad}}>
          <div style={{'position': 'absolute', 'inset': '0', 'background': 'linear-gradient(180deg,rgba(9,32,16,.28),transparent 30%,rgba(9,32,16,.5))'}}></div>
          <div style={{'position': 'absolute', 'top': '52px', 'left': '20px', 'right': '20px', 'display': 'flex', 'justifyContent': 'space-between'}}>
            <button onClick={back} style={{'width': '40px', 'height': '40px', 'borderRadius': '13px', 'border': 'none', 'background': 'rgba(255,255,255,.9)', 'color': '#12351d', 'fontSize': '18px', 'cursor': 'pointer'}}>←</button>
            <button style={{'width': '40px', 'height': '40px', 'borderRadius': '13px', 'border': 'none', 'background': 'rgba(255,255,255,.9)', 'cursor': 'pointer', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center'}}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#12351d" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.5-7-9.5A3.5 3.5 0 0 1 12 8a3.5 3.5 0 0 1 7 2.5c0 5-7 9.5-7 9.5z"/></svg>
            </button>
          </div>
          <div style={{'position': 'absolute', 'bottom': '18px', 'left': '20px'}}>
            <span style={{'background': '#e2822a', 'color': '#fff', 'fontSize': '11px', 'fontWeight': '700', 'padding': '5px 11px', 'borderRadius': '20px'}}>RERA Approved</span>
          </div>
        </div>

        <div style={{'padding': '20px 22px 0', 'marginTop': '-22px', 'background': '#f8fbf6', 'borderRadius': '24px 24px 0 0', 'position': 'relative'}}>
          <div style={{'display': 'flex', 'justifyContent': 'space-between', 'alignItems': 'flex-start'}}>
            <div>
              <p style={{'margin': '0', 'fontSize': '21px', 'fontWeight': '800', 'color': '#12351d'}}>{sel.name}</p>
              <p style={{'margin': '5px 0 0', 'fontSize': '13px', 'color': '#8a988c', 'fontWeight': '500'}}>📍 {sel.loc}</p>
            </div>
            <div style={{'textAlign': 'right'}}><p style={{'margin': '0', 'fontSize': '20px', 'fontWeight': '800', 'color': '#1a5e2e'}}>{sel.price}</p><p style={{'margin': '2px 0 0', 'fontSize': '11px', 'color': '#9aa89c', 'fontWeight': '600'}}>per sq.yd</p></div>
          </div>

          <div style={{'display': 'grid', 'gridTemplateColumns': '1fr 1fr', 'gap': '11px', 'marginTop': '18px'}}>
            { specGrid.map((s, index) => (
              <div style={{'background': '#fff', 'border': '1px solid #eef3ec', 'borderRadius': '14px', 'padding': '13px 14px'}}>
                <p style={{'margin': '0', 'fontSize': '11px', 'color': '#8a988c', 'fontWeight': '600'}}>{s.k}</p>
                <p style={{'margin': '5px 0 0', 'fontSize': '14px', 'fontWeight': '700', 'color': '#16231a'}}>{s.v}</p>
              </div>
            ))}
          </div>

          <p style={{'fontSize': '15px', 'fontWeight': '800', 'color': '#12351d', 'margin': '22px 0 8px'}}>About this project</p>
          <p style={{'margin': '0', 'fontSize': '13px', 'lineHeight': '1.65', 'color': '#5c6c5e'}}>A premium gated community of villa plots surrounded by landscaped greenery, wide internal roads and modern amenities — designed for families who value space, privacy and long-term appreciation.</p>

          <p style={{'fontSize': '15px', 'fontWeight': '800', 'color': '#12351d', 'margin': '22px 0 10px'}}>Amenities</p>
          <div style={{'display': 'flex', 'flexWrap': 'wrap', 'gap': '8px'}}>
            { amenities.map((a, index) => (
              <span style={{'fontSize': '12.5px', 'fontWeight': '600', 'color': '#3d4f40', 'background': '#fff', 'border': '1px solid #e6ede2', 'padding': '9px 14px', 'borderRadius': '12px'}}>{a}</span>
            ))}
          </div>
          <div style={{'height': '20px'}}></div>
        </div>

        <div style={{'position': 'sticky', 'bottom': '0', 'background': '#fff', 'borderTop': '1px solid #eef3ec', 'padding': '14px 22px', 'display': 'flex', 'gap': '12px'}}>
          <button style={{'flex': '1', 'height': '54px', 'borderRadius': '16px', 'border': '1.5px solid #1a5e2e', 'background': '#fff', 'color': '#1a5e2e', 'fontFamily': 'inherit', 'fontSize': '14.5px', 'fontWeight': '700', 'cursor': 'pointer'}}>Schedule Visit</button>
          <button style={{'flex': '1.3', 'height': '54px', 'borderRadius': '16px', 'border': 'none', 'background': 'linear-gradient(180deg,#eb9236,#e2822a)', 'color': '#fff', 'fontFamily': 'inherit', 'fontSize': '14.5px', 'fontWeight': '700', 'cursor': 'pointer', 'boxShadow': '0 12px 22px -10px rgba(226,130,42,.6)'}}>Book Now</button>
        </div>
      </div>
      )}

      {/* ===================== PAYMENT HISTORY ===================== */}
      {isPayHistory && (
      <div className="rv-screen">
        <div style={{'background': 'linear-gradient(160deg,#1a5e2e 0%,#123f21 100%)', 'padding': '56px 22px 22px', 'borderRadius': '0 0 26px 26px', 'display': 'flex', 'alignItems': 'center', 'gap': '14px'}}>
          <button onClick={back} style={{'width': '38px', 'height': '38px', 'borderRadius': '12px', 'border': 'none', 'background': 'rgba(255,255,255,.14)', 'color': '#fff', 'fontSize': '18px', 'cursor': 'pointer'}}>←</button>
          <span style={{'fontSize': '18px', 'fontWeight': '800', 'color': '#fff'}}>Payment History</span>
        </div>
        <div style={{'padding': '18px 22px 0', 'display': 'flex', 'flexDirection': 'column', 'gap': '12px'}}>
          { history.map((h, index) => (
            <div style={{'display': 'flex', 'alignItems': 'center', 'gap': '13px', 'background': '#fff', 'borderRadius': '16px', 'padding': '15px', 'border': '1px solid #eef3ec', 'boxShadow': '0 10px 26px -22px rgba(18,53,29,.5)'}}>
              <span style={{'width': '42px', 'height': '42px', 'borderRadius': '12px', 'background': '#e8f3e3', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'flex': 'none'}}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#1a5e2e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 4 10-10"/></svg>
              </span>
              <div style={{'flex': '1'}}>
                <p style={{'margin': '0', 'fontSize': '14px', 'fontWeight': '700', 'color': '#16231a'}}>{h.title}</p>
                <p style={{'margin': '3px 0 0', 'fontSize': '11.5px', 'color': '#8a988c', 'fontWeight': '500'}}>{h.date} • {h.mode}</p>
              </div>
              <div style={{'textAlign': 'right'}}>
                <p style={{'margin': '0', 'fontSize': '14.5px', 'fontWeight': '800', 'color': '#16231a'}}>{h.amt}</p>
                <p style={{'margin': '3px 0 0', 'fontSize': '10.5px', 'color': '#1a5e2e', 'fontWeight': '700'}}>Paid</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* ===================== EMI CALCULATOR ===================== */}
      {isEMI && (
      <div className="rv-screen">
        <div style={{'background': 'linear-gradient(160deg,#1a5e2e 0%,#123f21 100%)', 'padding': '56px 22px 22px', 'borderRadius': '0 0 26px 26px', 'display': 'flex', 'alignItems': 'center', 'gap': '14px'}}>
          <button onClick={back} style={{'width': '38px', 'height': '38px', 'borderRadius': '12px', 'border': 'none', 'background': 'rgba(255,255,255,.14)', 'color': '#fff', 'fontSize': '18px', 'cursor': 'pointer'}}>←</button>
          <span style={{'fontSize': '18px', 'fontWeight': '800', 'color': '#fff'}}>EMI Calculator</span>
        </div>
        <div style={{'padding': '22px'}}>
          <div style={{'background': 'linear-gradient(160deg,#1a5e2e,#124423)', 'borderRadius': '22px', 'padding': '22px', 'textAlign': 'center', 'boxShadow': '0 16px 34px -20px rgba(18,68,35,.8)'}}>
            <p style={{'margin': '0', 'fontSize': '12.5px', 'color': '#bcd6bd', 'fontWeight': '600'}}>Monthly EMI</p>
            <p style={{'margin': '10px 0 0', 'fontSize': '34px', 'fontWeight': '800', 'color': '#fff'}}>{emi}</p>
            <div style={{'display': 'flex', 'justifyContent': 'center', 'gap': '26px', 'marginTop': '16px'}}>
              <div><p style={{'margin': '0', 'fontSize': '11px', 'color': '#9cc39d', 'fontWeight': '600'}}>Total Interest</p><p style={{'margin': '5px 0 0', 'fontSize': '14px', 'fontWeight': '700', 'color': '#fff'}}>{emiInterest}</p></div>
              <div style={{'width': '1px', 'background': 'rgba(255,255,255,.16)'}}></div>
              <div><p style={{'margin': '0', 'fontSize': '11px', 'color': '#9cc39d', 'fontWeight': '600'}}>Total Payable</p><p style={{'margin': '5px 0 0', 'fontSize': '14px', 'fontWeight': '700', 'color': '#fff'}}>{emiTotal}</p></div>
            </div>
          </div>

          <div style={{'marginTop': '22px', 'display': 'flex', 'flexDirection': 'column', 'gap': '24px'}}>
            <div>
              <div style={{'display': 'flex', 'justifyContent': 'space-between', 'marginBottom': '12px'}}><span style={{'fontSize': '13.5px', 'fontWeight': '700', 'color': '#3d4f40'}}>Loan Amount</span><span style={{'fontSize': '14px', 'fontWeight': '800', 'color': '#1a5e2e'}}>{amountLabel}</span></div>
              <input type="range" min="500000" max="10000000" step="100000" value={amount} onInput={setAmount} style={{'width': '100%'}}/>
            </div>
            <div>
              <div style={{'display': 'flex', 'justifyContent': 'space-between', 'marginBottom': '12px'}}><span style={{'fontSize': '13.5px', 'fontWeight': '700', 'color': '#3d4f40'}}>Interest Rate</span><span style={{'fontSize': '14px', 'fontWeight': '800', 'color': '#1a5e2e'}}>{rate}%</span></div>
              <input type="range" min="6" max="15" step="0.25" value={rate} onInput={setRate} style={{'width': '100%'}}/>
            </div>
            <div>
              <div style={{'display': 'flex', 'justifyContent': 'space-between', 'marginBottom': '12px'}}><span style={{'fontSize': '13.5px', 'fontWeight': '700', 'color': '#3d4f40'}}>Tenure</span><span style={{'fontSize': '14px', 'fontWeight': '800', 'color': '#1a5e2e'}}>{years} yrs</span></div>
              <input type="range" min="1" max="30" step="1" value={years} onInput={setYears} style={{'width': '100%'}}/>
            </div>
          </div>
          <button style={{'marginTop': '28px', 'width': '100%', 'height': '56px', 'border': 'none', 'borderRadius': '16px', 'background': 'linear-gradient(180deg,#eb9236,#e2822a)', 'color': '#fff', 'fontFamily': 'inherit', 'fontSize': '15px', 'fontWeight': '700', 'cursor': 'pointer', 'boxShadow': '0 14px 26px -12px rgba(226,130,42,.6)'}}>Apply for Loan</button>
        </div>
      </div>
      )}

      {/* ===================== NOTIFICATIONS ===================== */}
      {isNotif && (
      <div className="rv-screen">
        <div style={{'background': 'linear-gradient(160deg,#1a5e2e 0%,#123f21 100%)', 'padding': '56px 22px 22px', 'borderRadius': '0 0 26px 26px', 'display': 'flex', 'alignItems': 'center', 'gap': '14px'}}>
          <button onClick={back} style={{'width': '38px', 'height': '38px', 'borderRadius': '12px', 'border': 'none', 'background': 'rgba(255,255,255,.14)', 'color': '#fff', 'fontSize': '18px', 'cursor': 'pointer'}}>←</button>
          <span style={{'fontSize': '18px', 'fontWeight': '800', 'color': '#fff'}}>Notifications</span>
        </div>
        <div style={{'padding': '18px 22px 0', 'display': 'flex', 'flexDirection': 'column', 'gap': '11px'}}>
          { notifs.map((n, index) => (
            <div style={{'display': '13px', 'background': n.bg, 'borderRadius': '16px', 'padding': '15px', 'border': '1px'}} solid #eef3ec>
              <span style={{'width': '40px', 'borderRadius': '12px', 'background': n.iconBg, 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'flex': 'none'}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={n.iconColor} stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d={n.icon}/></svg>
              </span>
              <div style={{'flex': '1'}}>
                <p style={{'margin': '0', 'fontSize': '13.5px', 'fontWeight': '700', 'color': '#16231a'}}>{n.title}</p>
                <p style={{'margin': '4px 0 0', 'fontSize': '12px', 'color': '#6d7d6f', 'fontWeight': '500', 'lineHeight': '1.5'}}>{n.body}</p>
                <p style={{'margin': '6px 0 0', 'fontSize': '10.5px', 'color': '#a3b0a4', 'fontWeight': '600'}}>{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* ===================== SETTINGS ===================== */}
      {isSettings && (
      <div className="rv-screen">
        <div style={{'background': 'linear-gradient(160deg,#1a5e2e 0%,#123f21 100%)', 'padding': '56px 22px 22px', 'borderRadius': '0 0 26px 26px', 'display': 'flex', 'alignItems': 'center', 'gap': '14px'}}>
          <button onClick={back} style={{'width': '38px', 'height': '38px', 'borderRadius': '12px', 'border': 'none', 'background': 'rgba(255,255,255,.14)', 'color': '#fff', 'fontSize': '18px', 'cursor': 'pointer'}}>←</button>
          <span style={{'fontSize': '18px', 'fontWeight': '800', 'color': '#fff'}}>Settings</span>
        </div>
        <div style={{'padding': '18px 22px 0'}}>
          <p style={{'fontSize': '12px', 'fontWeight': '700', 'color': '#8a988c', 'textTransform': 'uppercase', 'letterSpacing': '.5px', 'margin': '6px 0 10px'}}>Preferences</p>
          <div style={{'background': '#fff', 'borderRadius': '18px', 'border': '1px solid #eef3ec', 'overflow': 'hidden', 'boxShadow': '0 12px 30px -24px rgba(18,53,29,.5)'}}>
            { toggles.map((t, index) => (
              <div style={{'display': 'center', 'gap': '13px', 'padding': '15px'}} 18px;border-top:t.border>
                <span style={{'width': '36px', 'height': '36px', 'borderRadius': '11px', 'background': '#eef6ea', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'flex': 'none'}}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1a5e2e" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d={t.icon}/></svg>
                </span>
                <span style={{'flex': '1', 'fontSize': '14px', 'fontWeight': '600', 'color': '#16231a'}}>{t.label}</span>
                <button onClick={t.toggle} style={{'width': '28px', 'borderRadius': '16px', 'border': 'none', 'cursor': 'pointer', 'position': 'relative', 'background': t.track, 'transition': 'background'}} .2s>
                  <span style={{'position': '3px', 'left': t.knob, 'width': '22px', 'height': '22px', 'borderRadius': '50%', 'background': '#fff', 'transition': 'left'}} .2s;box-shadow:0 2px 5px rgba(0,0,0,.2)></span>
                </button>
              </div>
            ))}
          </div>

          <p style={{'fontSize': '12px', 'fontWeight': '700', 'color': '#8a988c', 'textTransform': 'uppercase', 'letterSpacing': '.5px', 'margin': '22px 0 10px'}}>General</p>
          <div style={{'background': '#fff', 'borderRadius': '18px', 'border': '1px solid #eef3ec', 'overflow': 'hidden', 'boxShadow': '0 12px 30px -24px rgba(18,53,29,.5)'}}>
            { settingLinks.map((s, index) => (
              <button style={{'width': 'flex', 'alignItems': 'center', 'gap': '13px', 'padding': '15px'}} 18px;border:none;background:transparent;cursor:pointer;font-family:inherit;border-top:s.border>
                <span style={{'width': '36px', 'height': '36px', 'borderRadius': '11px', 'background': '#eef6ea', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'flex': 'none'}}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1a5e2e" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d={s.icon}/></svg>
                </span>
                <span style={{'flex': '1', 'textAlign': 'left', 'fontSize': '14px', 'fontWeight': '600', 'color': '#16231a'}}>{s.label}</span>
                <span style={{'fontSize': '12.5px', 'color': '#a3b0a4', 'fontWeight': '600', 'marginRight': '6px'}}>{s.value}</span>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#c2cdc0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>
              </button>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* ===================== PERSONAL DETAILS ===================== */}
      {isPersonal && (
      <div className="rv-screen">
        <div style={{'background': 'linear-gradient(160deg,#1a5e2e 0%,#123f21 100%)', 'padding': '56px 22px 22px', 'borderRadius': '0 0 26px 26px', 'display': 'flex', 'alignItems': 'center', 'gap': '14px'}}>
          <button onClick={back} style={{'width': '38px', 'height': '38px', 'borderRadius': '12px', 'border': 'none', 'background': 'rgba(255,255,255,.14)', 'color': '#fff', 'fontSize': '18px', 'cursor': 'pointer'}}>←</button>
          <span style={{'fontSize': '18px', 'fontWeight': '800', 'color': '#fff'}}>Personal Details</span>
        </div>
        <div style={{'padding': '22px'}}>
          <div style={{'display': 'flex', 'flexDirection': 'column', 'alignItems': 'center', 'marginBottom': '8px'}}>
            <div style={{'width': '78px', 'height': '78px', 'borderRadius': '24px', 'background': 'linear-gradient(160deg,#1a5e2e,#124423)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'fontSize': '28px', 'fontWeight': '800', 'color': '#fff'}}>{initials}</div>
            <button style={{'marginTop': '12px', 'border': '1px solid #e2e8e0', 'background': '#fff', 'borderRadius': '20px', 'padding': '7px 16px', 'fontFamily': 'inherit', 'fontSize': '12.5px', 'fontWeight': '700', 'color': '#1a5e2e', 'cursor': 'pointer'}}>Change Photo</button>
          </div>
          { personalFields.map((p, index) => (
            <div style={{'marginTop': '15px'}}>
              <label style={{'fontSize': '12.5px', 'fontWeight': '700', 'color': '#3d4f40'}}>{p.label}</label>
              <div style={{'marginTop': '8px', 'display': 'flex', 'alignItems': 'center', 'height': '54px', 'border': '1.5px solid #e2e8e0', 'borderRadius': '15px', 'padding': '0 15px', 'background': '#fbfdfa'}}>
                <input value={p.value} style={{'flex': '1', 'border': 'none', 'background': 'transparent', 'fontFamily': 'inherit', 'fontSize': '14.5px', 'fontWeight': '600', 'color': '#16231a'}}/>
              </div>
            </div>
          ))}
          <button style={{'marginTop': '26px', 'width': '100%', 'height': '56px', 'border': 'none', 'borderRadius': '16px', 'background': 'linear-gradient(180deg,#1a5e2e,#124423)', 'color': '#fff', 'fontFamily': 'inherit', 'fontSize': '15px', 'fontWeight': '700', 'cursor': 'pointer', 'boxShadow': '0 14px 26px -12px rgba(18,68,35,.7)'}}>Save Changes</button>
        </div>
      </div>
      )}

      {/* ===================== KYC ===================== */}
      {isKYC && (
      <div className="rv-screen">
        <div style={{'background': 'linear-gradient(160deg,#1a5e2e 0%,#123f21 100%)', 'padding': '56px 22px 22px', 'borderRadius': '0 0 26px 26px', 'display': 'flex', 'alignItems': 'center', 'gap': '14px'}}>
          <button onClick={back} style={{'width': '38px', 'height': '38px', 'borderRadius': '12px', 'border': 'none', 'background': 'rgba(255,255,255,.14)', 'color': '#fff', 'fontSize': '18px', 'cursor': 'pointer'}}>←</button>
          <span style={{'fontSize': '18px', 'fontWeight': '800', 'color': '#fff'}}>KYC Verification</span>
        </div>
        <div style={{'padding': '22px'}}>
          <div style={{'background': '#e8f3e3', 'border': '1px solid #cfe6c6', 'borderRadius': '20px', 'padding': '22px', 'textAlign': 'center'}}>
            <div style={{'width': '64px', 'height': '64px', 'borderRadius': '20px', 'background': '#1a5e2e', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'margin': '0 auto'}}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 4-3 7-7 8-4-1-7-4-7-8V6z M9 12l2 2 4-4"/></svg>
            </div>
            <p style={{'margin': '14px 0 4px', 'fontSize': '17px', 'fontWeight': '800', 'color': '#12351d'}}>Verification Complete</p>
            <p style={{'margin': '0', 'fontSize': '12.5px', 'color': '#4a6b4a', 'fontWeight': '500'}}>Your identity has been verified successfully</p>
          </div>
          <p style={{'fontSize': '14px', 'fontWeight': '800', 'color': '#12351d', 'margin': '24px 0 12px'}}>Submitted Documents</p>
          <div style={{'display': 'flex', 'flexDirection': 'column', 'gap': '12px'}}>
            { kycDocs.map((d, index) => (
              <div style={{'display': 'flex', 'alignItems': 'center', 'gap': '13px', 'background': '#fff', 'borderRadius': '16px', 'padding': '15px', 'border': '1px solid #eef3ec', 'boxShadow': '0 10px 26px -22px rgba(18,53,29,.5)'}}>
                <span style={{'width': '42px', 'height': '42px', 'borderRadius': '12px', 'background': '#eef6ea', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'flex': 'none'}}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#1a5e2e" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h9l4 4v14H6zM14 3v5h5"/></svg>
                </span>
                <div style={{'flex': '1'}}><p style={{'margin': '0', 'fontSize': '14px', 'fontWeight': '700', 'color': '#16231a'}}>{d.name}</p><p style={{'margin': '3px 0 0', 'fontSize': '11.5px', 'color': '#8a988c', 'fontWeight': '500'}}>{d.num}</p></div>
                <span style={{'fontSize': '11px', 'fontWeight': '700', 'color': '#1a5e2e', 'background': '#e8f3e3', 'padding': '5px 11px', 'borderRadius': '20px'}}>✓ Verified</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}

    </div>

    


    {/* ===================== MAIN NAV ===================== */}
    <nav className="rv-nav">
      <button className={`rv-nav-btn ${navClassHome}`} onClick={goHome}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5"/></svg>
        <span className="nav-label">Home</span>
      </button>
      <button className="rv-nav-btn" onClick={goVisitsPage}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M9 14l2 2 4-4"/></svg>
        <span className="nav-label">Site Visits</span>
      </button>
      <button className={`rv-nav-btn ${navClassProps}`} onClick={goProps}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 21V4h9v17M9 8h3M9 12h3M9 16h3M6 21h13"/></svg>
        <span className="nav-label">My Lands</span>
      </button>
      <button className={`rv-nav-btn ${navClassPayments}`} onClick={goPayments}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h18v11H3zM3 10.5h18"/></svg>
        <span className="nav-label">Payments</span>
      </button>
      <button className={`rv-nav-btn ${navClassProfile}`} onClick={goProfile}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M5 20c0-3.5 3-6 7-6s7 2.5 7 6"/></svg>
        <span className="nav-label">Profile</span>
      </button>
    </nav>




    {/* ===================== SUCCESS MODAL ===================== */}
    {showPaidModal && (
    <div onClick={closeModal} style={{'position': 'absolute', 'inset': '0', 'background': 'rgba(9,32,16,.5)', 'backdropFilter': 'blur(3px)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'zIndex': '70', 'padding': '30px'}}>
      <div style={{'background': '#fff', 'borderRadius': '26px', 'padding': '30px 26px', 'textAlign': 'center', 'width': '100%', 'animation': 'rvPop .3s cubic-bezier(.22,1.2,.5,1) both'}}>
        <div style={{'width': '84px', 'height': '84px', 'borderRadius': '28px', 'background': 'linear-gradient(180deg,#1a5e2e,#124423)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'margin': '0 auto'}}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 4 10-10"/></svg>
        </div>
        <p style={{'margin': '18px 0 6px', 'fontSize': '20px', 'fontWeight': '800', 'color': '#12351d'}}>Payment Successful</p>
        <p style={{'margin': '0', 'fontSize': '13.5px', 'color': '#6d7d6f', 'lineHeight': '1.55'}}>₹1,00,000 has been paid towards<br>Emerald Estate • Plot A-120</p>
        <button onClick={closeModal} style={{'marginTop': '22px', 'width': '100%', 'height': '52px', 'border': 'none', 'borderRadius': '15px', 'background': 'linear-gradient(180deg,#eb9236,#e2822a)', 'color': '#fff', 'fontFamily': 'inherit', 'fontSize': '15px', 'fontWeight': '700', 'cursor': 'pointer'}}>Done</button>
      </div>
    </div>
    )}

  </div>

  
