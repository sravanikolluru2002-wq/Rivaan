

  <div className="rv-phone">
    <div style={{'position': 'absolute', 'top': '0', 'left': '50%', 'transform': 'translateX(-50%)', 'width': '150px', 'height': '30px', 'background': '#0c2615', 'borderRadius': '0 0 20px 20px', 'zIndex': '60'}}></div>
    <div style={{'position': '0', 'left': '0', 'right': '0', 'height': '50px', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between', 'padding': '0'}} 28px;font-size:13.5px;font-weight:700;color:statusColor;z-index:50;pointer-events:none>
      <span>9:41</span><span style={{'fontSize': '11px', 'letterSpacing': '1px'}}>▟▟▟ 100%</span>
    </div>

    <div className="rv-scroll" style={{'position': 'absolute', 'inset': '0', 'overflowY': 'auto'}}>

      {/* ===================== MY LANDS ===================== */}
      {isLands && (
      <div className="rv-screen">
        <div style={{'background': 'linear-gradient(160deg,#1a5e2e 0%,#123f21 100%)', 'padding': '56px 22px 22px', 'borderRadius': '0 0 26px 26px'}}>
          <div style={{'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between'}}>
            <div style={{'display': 'flex', 'alignItems': 'center', 'gap': '10px'}}>
              <img src="assets/logo-mark-white.png" alt="Rivan" style={{'height': '26px', 'opacity': '.95'}} />
              <span style={{'fontSize': '19px', 'fontWeight': '800', 'color': '#fff'}}>My Lands</span>
            </div>
            <button style={{'width': '40px', 'height': '40px', 'borderRadius': '12px', 'border': 'none', 'background': 'rgba(255,255,255,.14)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'cursor': 'pointer', 'position': 'relative'}}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 20a2 2 0 0 0 4 0"/></svg>
              <span style={{'position': 'absolute', 'top': '9px', 'right': '10px', 'width': '7px', 'height': '7px', 'borderRadius': '50%', 'background': '#eb9236', 'border': '1.5px solid #123f21'}}></span>
            </button>
          </div>
          <div style={{'marginTop': '16px', 'background': 'rgba(255,255,255,.1)', 'border': '1px solid rgba(255,255,255,.16)', 'borderRadius': '18px', 'padding': '16px', 'display': 'flex'}}>
            <div style={{'flex': '1'}}><p style={{'margin': '0', 'fontSize': '11.5px', 'color': '#bcd6bd', 'fontWeight': '600'}}>Total Lands</p><p style={{'margin': '7px 0 0', 'fontSize': '24px', 'fontWeight': '800', 'color': '#fff'}}>{totalLands}</p></div>
            <div style={{'width': '1px', 'background': 'rgba(255,255,255,.16)'}}></div>
            <div style={{'flex': '1.4', 'paddingLeft': '16px'}}><p style={{'margin': '0', 'fontSize': '11.5px', 'color': '#bcd6bd', 'fontWeight': '600'}}>Total Investment</p><p style={{'margin': '7px 0 0', 'fontSize': '24px', 'fontWeight': '800', 'color': '#fff'}}>{totalInvest}</p></div>
          </div>
        </div>

        <div style={{'padding': '18px 22px 0'}}>
          <div style={{'display': 'flex', 'alignItems': 'center', 'gap': '10px', 'height': '48px', 'border': '1px solid #e6ede2', 'borderRadius': '15px', 'padding': '0 14px', 'background': '#fbfdfa'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c8c7e" stroke-width="1.8" stroke-linecap="round"><path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14M20 20l-3.5-3.5"/></svg>
            <input placeholder="Search by project, plot no. or location" style={{'flex': '1', 'border': 'none', 'background': 'transparent', 'fontFamily': 'inherit', 'fontSize': '13px', 'fontWeight': '500', 'color': '#16231a'}}/>
          </div>

          <div style={{'display': 'flex', 'gap': '8px', 'overflowX': 'auto', 'marginTop': '14px'}} className="rv-scroll">
            { chips.map((c, index) => (
              <button onClick={c.pick} style={c.style}>{c.label}</button>
            ))}
          </div>

          {/* LOADING */}
          {stLoading && (
          <div style={{'display': 'flex', 'flexDirection': 'column', 'gap': '14px', 'marginTop': '18px'}}>
            { skels.map((s, index) => (
              <div style={{'display': 'flex', 'gap': '13px', 'background': '#fff', 'borderRadius': '18px', 'padding': '14px', 'border': '1px solid #eef3ec'}}>
                <div className="rv-skel" style={{'width': '74px', 'height': '74px', 'borderRadius': '13px'}}></div>
                <div style={{'flex': '1', 'display': 'flex', 'flexDirection': 'column', 'gap': '9px', 'justifyContent': 'center'}}>
                  <div className="rv-skel" style={{'height': '13px', 'width': '60%', 'borderRadius': '6px'}}></div>
                  <div className="rv-skel" style={{'height': '11px', 'width': '40%', 'borderRadius': '6px'}}></div>
                  <div className="rv-skel" style={{'height': '11px', 'width': '50%', 'borderRadius': '6px'}}></div>
                </div>
              </div>
            ))}
          </div>
          )}

          {/* ERROR */}
          {stError && (
          <div style={{'display': 'flex', 'flexDirection': 'column', 'alignItems': 'center', 'textAlign': 'center', 'padding': '52px 24px'}}>
            <div style={{'width': '82px', 'height': '82px', 'borderRadius': '26px', 'background': '#fdecec', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center'}}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#c0392b" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v5M12 16h.01M10.3 3.8 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0z"/></svg>
            </div>
            <p style={{'margin': '20px 0 6px', 'fontSize': '16px', 'fontWeight': '800', 'color': '#12351d'}}>Couldn't load your lands</p>
            <p style={{'margin': '0 0 20px', 'fontSize': '13px', 'color': '#8a988c', 'maxWidth': '230px', 'lineHeight': '1.5'}}>Please check your internet connection and try again.</p>
            <button onClick={retry} style={{'height': '46px', 'padding': '0 28px', 'border': 'none', 'borderRadius': '14px', 'background': 'linear-gradient(180deg,#1a5e2e,#124423)', 'color': '#fff', 'fontFamily': 'inherit', 'fontSize': '14px', 'fontWeight': '700', 'cursor': 'pointer'}}>↻ Retry</button>
          </div>
          )}

          {/* EMPTY */}
          {stEmpty && (
          <div style={{'display': 'flex', 'flexDirection': 'column', 'alignItems': 'center', 'textAlign': 'center', 'padding': '48px 24px'}}>
            <div style={{'width': '96px', 'height': '96px', 'borderRadius': '30px', 'background': '#eef6ea', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center'}}>
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#8fae8c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5M10 21v-6h4v6"/></svg>
            </div>
            <p style={{'margin': '22px 0 6px', 'fontSize': '17px', 'fontWeight': '800', 'color': '#12351d'}}>No properties yet</p>
            <p style={{'margin': '0 0 22px', 'fontSize': '13.5px', 'color': '#8a988c', 'maxWidth': '250px', 'lineHeight': '1.55'}}>Start your investment journey with Rivan Reality — explore premium plots, villas and farmlands.</p>
            <button style={{'height': '52px', 'padding': '0 32px', 'border': 'none', 'borderRadius': '15px', 'background': 'linear-gradient(180deg,#eb9236,#e2822a)', 'color': '#fff', 'fontFamily': 'inherit', 'fontSize': '15px', 'fontWeight': '700', 'cursor': 'pointer', 'boxShadow': '0 12px 24px -10px rgba(226,130,42,.6)'}}>Explore Properties</button>
          </div>
          )}

          {/* READY LIST */}
          {stReady && (
          <div style={{'display': 'flex', 'flexDirection': 'column', 'gap': '15px', 'marginTop': '16px'}}>
            { lands.map((p, index) => (
              <div style={{'background': '#fff', 'borderRadius': '20px', 'border': '1px solid #eef3ec', 'overflow': 'hidden', 'boxShadow': '0 12px 30px -22px rgba(18,53,29,.5)'}}>
                <div onClick={p.open} style={{'padding': '14px', 'cursor': 'pointer'}}>
                  <div style={{'display': 'flex', 'gap': '13px'}}>
                    <div style={{'width': '78px', 'borderRadius': '14px', 'background': p.grad, 'flex': 'none', 'position': 'relative'}}>
                      <span style={{'position': 'absolute', 'bottom': '6px', 'left': '6px', 'background': 'rgba(9,32,16,.6)', 'color': '#fff', 'fontSize': '9px', 'fontWeight': '700', 'padding': '2px 7px', 'borderRadius': '20px', 'backdropFilter': 'blur(4px)'}}>{p.typeShort}</span>
                    </div>
                    <div style={{'flex': '1', 'minWidth': '0'}}>
                      <div style={{'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between', 'gap': '8px'}}>
                        <p style={{'margin': '0', 'fontSize': '15px', 'fontWeight': '800', 'color': '#16231a'}}>{p.name}</p>
                        <span style={{'fontSize': '10.5px', 'fontWeight': '700', 'color': '#1a5e2e', 'background': '#e8f3e3', 'padding': '3px 9px', 'borderRadius': '20px', 'flex': 'none'}}>{p.status}</span>
                      </div>
                      <p style={{'margin': '4px 0 5px', 'fontSize': '13px', 'fontWeight': '700', 'color': '#3d4f40'}}>{p.code}</p>
                      <p style={{'margin': '0', 'fontSize': '11.5px', 'color': '#8a988c', 'fontWeight': '500'}}>{p.spec}</p>
                      <p style={{'margin': '3px 0 0', 'fontSize': '11.5px', 'color': '#8a988c', 'fontWeight': '500'}}>Purchased on {p.date}</p>
                    </div>
                  </div>
                </div>
                {/* in-card services strip */}
                <div style={{'display': 'flex', 'alignItems': 'center', 'gap': '9px', 'padding': '12px 14px', 'borderTop': '1px dashed #e6ede2', 'background': '#fbfdf9'}}>
                  <div style={{'display': 'flex', 'gap': '6px', 'flex': '1'}}>
                    { p.svcPreview.map((sv, index) => (
                      <span title={sv.name} style={{'width': '32px', 'height': '32px', 'borderRadius': '10px', 'background': '#eef6ea', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center'}}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a5e2e" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d={sv.icon}/></svg>
                      </span>
                    ))}
                    <span style={{'fontSize': '11px', 'fontWeight': '600', 'color': '#6d7d6f', 'alignSelf': 'center'}}>+{p.svcMore} services</span>
                  </div>
                  <button onClick={p.addServices} style={{'display': 'flex', 'alignItems': 'center', 'gap': '5px', 'border': '1px solid #cfe6c6', 'background': '#fff', 'color': '#1a5e2e', 'borderRadius': '11px', 'padding': '8px 13px', 'fontFamily': 'inherit', 'fontSize': '12px', 'fontWeight': '700', 'cursor': 'pointer'}}>＋ Add Services</button>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>
      )}

      {/* ===================== SELECT PROPERTY (overview) ===================== */}
      {isDetail && (
      <div className="rv-screen">
        <div style={{'position': '210px', 'background': sel.grad}}>
          <div style={{'position': 'absolute', 'inset': '0', 'background': 'linear-gradient(180deg,rgba(9,32,16,.25),transparent 40%,rgba(9,32,16,.35))'}}></div>
          <div style={{'position': 'absolute', 'top': '52px', 'left': '20px', 'right': '20px', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between'}}>
            <button onClick={back} style={{'width': '40px', 'height': '40px', 'borderRadius': '13px', 'border': 'none', 'background': 'rgba(255,255,255,.92)', 'color': '#12351d', 'fontSize': '18px', 'cursor': 'pointer'}}>←</button>
            <span style={{'fontSize': '16px', 'fontWeight': '800', 'color': '#fff', 'textShadow': '0 1px 6px rgba(0,0,0,.4)'}}>{sel.name}</span>
            <button style={{'width': '40px', 'height': '40px', 'borderRadius': '13px', 'border': 'none', 'background': 'rgba(255,255,255,.92)', 'cursor': 'pointer', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center'}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#12351d" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13"/></svg>
            </button>
          </div>
        </div>

        <div style={{'padding': '20px 22px 0', 'marginTop': '-24px', 'background': '#f8fbf6', 'borderRadius': '24px 24px 0 0', 'position': 'relative'}}>
          <div style={{'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between'}}>
            <div>
              <p style={{'margin': '0', 'fontSize': '20px', 'fontWeight': '800', 'color': '#12351d'}}>{sel.code}</p>
              <p style={{'margin': '5px 0 0', 'fontSize': '13px', 'color': '#6d7d6f', 'fontWeight': '500'}}>{sel.spec}</p>
              <p style={{'margin': '5px 0 0', 'fontSize': '12px', 'color': '#8a988c', 'fontWeight': '500'}}>Registration No. {sel.reg}</p>
            </div>
            <span style={{'fontSize': '11px', 'fontWeight': '700', 'color': '#1a5e2e', 'background': '#e8f3e3', 'padding': '5px 12px', 'borderRadius': '20px'}}>{sel.status}</span>
          </div>

          <div style={{'marginTop': '18px', 'background': '#fff', 'border': '1px solid #eef3ec', 'borderRadius': '18px', 'padding': '16px', 'boxShadow': '0 12px 30px -24px rgba(18,53,29,.5)'}}>
            <div style={{'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between'}}>
              <span style={{'fontSize': '13px', 'fontWeight': '700', 'color': '#3d4f40'}}>Progress Overview</span>
              <span style={{'fontSize': '20px', 'fontWeight': '800', 'color': '#1a5e2e'}}>{sel.progress}</span>
            </div>
            <div style={{'height': '9px', 'borderRadius': '6px', 'background': '#eef3ec', 'overflow': 'hidden', 'margin': '12px 0 14px'}}><div style={{'height': '6px', 'background': 'linear-gradient(90deg,#1a5e2e,#2f8544)', 'width': sel.progress}}></div></div>
            <div style={{'display': 'flex', 'justifyContent': 'space-between'}}>
              <div><p style={{'margin': '0', 'fontSize': '11px', 'color': '#8a988c', 'fontWeight': '600'}}>Paid Amount</p><p style={{'margin': '5px 0 0', 'fontSize': '15px', 'fontWeight': '800', 'color': '#16231a'}}>{sel.paid}</p></div>
              <div style={{'textAlign': 'right'}}><p style={{'margin': '0', 'fontSize': '11px', 'color': '#8a988c', 'fontWeight': '600'}}>Remaining</p><p style={{'margin': '5px 0 0', 'fontSize': '15px', 'fontWeight': '800', 'color': '#e2822a'}}>{sel.remaining}</p></div>
            </div>
          </div>

          <div style={{'display': 'grid', 'gridTemplateColumns': 'repeat(4,1fr)', 'gap': '9px', 'marginTop': '16px'}}>
            { quickActions.map((q, index) => (
              <div style={{'background': '#fff', 'border': '1px solid #eef3ec', 'borderRadius': '15px', 'padding': '13px 6px', 'display': 'flex', 'flexDirection': 'column', 'alignItems': 'center', 'gap': '8px'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a5e2e" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d={q.icon}/></svg>
                <span style={{'fontSize': '10.5px', 'fontWeight': '600', 'color': '#4a5c4d', 'textAlign': 'center'}}>{q.label}</span>
              </div>
            ))}
          </div>

          <div style={{'marginTop': '16px', 'background': '#fff', 'border': '1px solid #eef3ec', 'borderRadius': '18px', 'padding': '16px', 'boxShadow': '0 12px 30px -24px rgba(18,53,29,.5)'}}>
            <p style={{'margin': '0 0 12px', 'fontSize': '14px', 'fontWeight': '800', 'color': '#12351d'}}>About this Property</p>
            { aboutRows.map((a, index) => (
              <div style={{'display': 'flex', 'justifyContent': 'space-between', 'padding': '7px 0'}}><span style={{'fontSize': '12.5px', 'color': '#8a988c', 'fontWeight': '500'}}>{a.k}</span><span style={{'fontSize': '12.5px', 'color': '#16231a', 'fontWeight': '700'}}>{a.v}</span></div>
            ))}
          </div>

          <button onClick={goPlotInfo} style={{'margin': '18px 0', 'width': '100%', 'height': '56px', 'border': 'none', 'borderRadius': '16px', 'background': 'linear-gradient(180deg,#1a5e2e,#124423)', 'color': '#fff', 'fontFamily': 'inherit', 'fontSize': '15px', 'fontWeight': '700', 'cursor': 'pointer', 'boxShadow': '0 14px 26px -12px rgba(18,68,35,.7)'}}>View {sel.infoLabel}</button>
        </div>
      </div>
      )}

      {/* ===================== PLOT INFO ===================== */}
      {isPlotInfo && (
      <div className="rv-screen">
        <div style={{'background': 'linear-gradient(160deg,#1a5e2e 0%,#123f21 100%)', 'padding': '56px 22px 22px', 'borderRadius': '0 0 26px 26px', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between'}}>
          <div style={{'display': 'flex', 'alignItems': 'center', 'gap': '14px'}}>
            <button onClick={back} style={{'width': '38px', 'height': '38px', 'borderRadius': '12px', 'border': 'none', 'background': 'rgba(255,255,255,.14)', 'color': '#fff', 'fontSize': '18px', 'cursor': 'pointer'}}>←</button>
            <span style={{'fontSize': '18px', 'fontWeight': '800', 'color': '#fff'}}>{sel.infoLabel}</span>
          </div>
          <button onClick={goOrders} style={{'width': '38px', 'height': '38px', 'borderRadius': '12px', 'border': 'none', 'background': 'rgba(255,255,255,.14)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'cursor': 'pointer'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h9l4 4v14H6zM14 3v5h5M9 13h6M9 17h4"/></svg>
          </button>
        </div>

        <div style={{'padding': '18px 22px 0'}}>
          {/* stylized map */}
          <div style={{'height': '170px', 'borderRadius': '18px', 'overflow': 'hidden', 'position': 'relative', 'background': 'linear-gradient(160deg,#eef6ea,#dce9d4)', 'border': '1px solid #dbe7d4'}}>
            <div style={{'position': 'absolute', 'inset': '0', 'backgroundImage': 'linear-gradient(#c9dcc0 1px,transparent 1px),linear-gradient(90deg,#c9dcc0 1px,transparent 1px)', 'backgroundSize': '26px 26px', 'opacity': '.5'}}></div>
            <div style={{'position': 'absolute', 'top': '16px', 'left': '16px', 'right': '16px', 'display': 'flex', 'flexWrap': 'wrap', 'gap': '7px'}}>
              { mapPlots.map((mp, index) => (
                <span style={mp.style}>{mp.label}</span>
              ))}
            </div>
            <span style={{'position': 'absolute', 'bottom': '12px', 'right': '14px', 'background': '#1a5e2e', 'color': '#fff', 'fontSize': '10px', 'fontWeight': '700', 'padding': '4px 10px', 'borderRadius': '20px'}}>📍 Your Plot</span>
          </div>

          <div style={{'marginTop': '16px', 'background': '#fff', 'border': '1px solid #eef3ec', 'borderRadius': '20px', 'padding': '6px 16px', 'boxShadow': '0 12px 30px -24px rgba(18,53,29,.5)'}}>
            <div style={{'padding': '12px 0 4px'}}><p style={{'margin': '0', 'fontSize': '16px', 'fontWeight': '800', 'color': '#16231a'}}>{sel.code}</p><p style={{'margin': '4px 0 0', 'fontSize': '12.5px', 'color': '#8a988c', 'fontWeight': '500'}}>{sel.spec}</p></div>
            { specRows.map((s, index) => (
              <div style={{'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between', 'padding': '13px 0', 'borderTop': '1px solid #f0f4ee'}}>
                <span style={{'fontSize': '13px', 'color': '#6d7d6f', 'fontWeight': '500'}}>{s.k}</span>
                <span style={font}-size:13px;color:s.color;font-weight:700>{s.v} {s.arrow}</span>
              </div>
            ))}
          </div>

          {/* add-on features preview */}
          <div style={{'marginTop': '16px', 'background': '#fff', 'border': '1px solid #eef3ec', 'borderRadius': '20px', 'padding': '18px', 'boxShadow': '0 12px 30px -24px rgba(18,53,29,.5)'}}>
            <p style={{'margin': '0', 'fontSize': '15px', 'fontWeight': '800', 'color': '#12351d'}}>Add-on Features</p>
            <p style={{'margin': '6px 0 14px', 'fontSize': '12.5px', 'color': '#8a988c', 'fontWeight': '500', 'lineHeight': '1.5'}}>Add services to secure, improve and maintain your property.</p>
            <div style={{'display': 'flex', 'flexDirection': 'column', 'gap': '9px'}}>
              { addonPreview.map((c, index) => (
                <div style={{'display': 'flex', 'alignItems': 'center', 'gap': '12px', 'padding': '11px', 'border': '1px solid #f0f4ee', 'borderRadius': '13px'}}>
                  <span style={{'width': '38px', 'height': '38px', 'borderRadius': '11px', 'background': '#eef6ea', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'flex': 'none'}}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a5e2e" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d={c.icon}/></svg>
                  </span>
                  <div style={{'flex': '1'}}><p style={{'margin': '0', 'fontSize': '13.5px', 'fontWeight': '700', 'color': '#16231a'}}>{c.name}</p><p style={{'margin': '2px 0 0', 'fontSize': '11px', 'color': '#9aa89c', 'fontWeight': '500'}}>{c.count} services</p></div>
                </div>
              ))}
            </div>
            <button onClick={goAddons} style={{'marginTop': '16px', 'width': '100%', 'height': '52px', 'border': 'none', 'borderRadius': '15px', 'background': 'linear-gradient(180deg,#eb9236,#e2822a)', 'color': '#fff', 'fontFamily': 'inherit', 'fontSize': '14.5px', 'fontWeight': '700', 'cursor': 'pointer', 'boxShadow': '0 12px 24px -12px rgba(226,130,42,.55)'}}>＋ Add Services</button>
          </div>
          <div style={{'height': '20px'}}></div>
        </div>
      </div>
      )}

      {/* ===================== ADD-ON FEATURES ===================== */}
      {isAddons && (
      <div className="rv-screen">
        <div style={{'background': 'linear-gradient(160deg,#1a5e2e 0%,#123f21 100%)', 'padding': '56px 22px 20px', 'borderRadius': '0 0 26px 26px'}}>
          <div style={{'display': 'flex', 'alignItems': 'center', 'gap': '14px'}}>
            <button onClick={back} style={{'width': '38px', 'height': '38px', 'borderRadius': '12px', 'border': 'none', 'background': 'rgba(255,255,255,.14)', 'color': '#fff', 'fontSize': '18px', 'cursor': 'pointer'}}>←</button>
            <span style={{'fontSize': '18px', 'fontWeight': '800', 'color': '#fff'}}>Add-on Features</span>
          </div>
          <p style={{'margin': '12px 0 0', 'fontSize': '12.5px', 'color': '#bcd6bd', 'fontWeight': '500'}}>Select services for your {sel.typeShort}</p>
        </div>

        <div style={{'padding': '18px 22px 0', 'display': 'flex', 'flexDirection': 'column', 'gap': '14px'}}>
          { categories.map((c, index) => (
            <div onClick={c.open} style={{'background': '#fff', 'border': '1px solid #eef3ec', 'borderRadius': '20px', 'padding': '18px', 'boxShadow': '0 12px 30px -24px rgba(18,53,29,.5)', 'cursor': 'pointer'}}>
              <div style={{'display': 'flex', 'alignItems': 'center', 'gap': '12px'}}>
                <span style={{'width': '44px', 'height': '44px', 'borderRadius': '13px', 'background': '#eef6ea', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'flex': 'none'}}>
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#1a5e2e" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d={c.icon}/></svg>
                </span>
                <div style={{'flex': '1'}}><p style={{'margin': '0', 'fontSize': '15px', 'fontWeight': '800', 'color': '#16231a'}}>{c.name}</p><p style={{'margin': '3px 0 0', 'fontSize': '11.5px', 'color': '#8a988c', 'fontWeight': '500'}}>{c.desc}</p></div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c2cdc0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>
              </div>
              <div style={{'display': 'flex', 'flexWrap': 'wrap', 'gap': '7px', 'marginTop': '14px'}}>
                { c.chips.map((ch, index) => (
                  <span style={{'fontSize': '11.5px', 'fontWeight': '600', 'color': '#3d4f40', 'background': '#f2f7ef', 'border': '1px solid #e6ede2', 'padding': '6px 11px', 'borderRadius': '20px'}}>{ch}</span>
                ))}
              </div>
            </div>
          ))}

          <div style={{'display': 'flex', 'alignItems': 'center', 'gap': '11px', 'background': '#f2f7ef', 'border': '1px solid #e0ebd9', 'borderRadius': '16px', 'padding': '14px 16px'}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a5e2e" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16v-4M12 8h.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"/></svg>
            <div style={{'flex': '1'}}><p style={{'margin': '0', 'fontSize': '12px', 'color': '#4a5c4d', 'fontWeight': '600'}}>Services shown are based on <strong style={{'color': '#1a5e2e'}}>{sel.typeShort}</strong> type</p></div>
          </div>
        </div>
      </div>
      )}

      {/* ===================== CHOOSE SERVICE ===================== */}
      {isChoose && (
      <div className="rv-screen">
        <div style={{'background': 'linear-gradient(160deg,#1a5e2e 0%,#123f21 100%)', 'padding': '56px 22px 20px', 'borderRadius': '0 0 26px 26px', 'display': 'flex', 'alignItems': 'center', 'gap': '14px'}}>
          <button onClick={back} style={{'width': '38px', 'height': '38px', 'borderRadius': '12px', 'border': 'none', 'background': 'rgba(255,255,255,.14)', 'color': '#fff', 'fontSize': '18px', 'cursor': 'pointer'}}>←</button>
          <span style={{'fontSize': '18px', 'fontWeight': '800', 'color': '#fff'}}>{cat.name}</span>
        </div>

        <div style={{'padding': '18px 22px 0', 'display': 'flex', 'flexDirection': 'column', 'gap': '13px'}}>
          { services.map((s, index) => (
            <div onClick={s.open} style={{'display': 'flex', 'gap': '14px', 'background': '#fff', 'border': '1px solid #eef3ec', 'borderRadius': '18px', 'padding': '14px', 'boxShadow': '0 12px 30px -24px rgba(18,53,29,.5)', 'cursor': 'pointer'}}>
              <div style={{'width': '76px', 'borderRadius': '14px', 'background': s.grad, 'flex': 'none', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center'}}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d={s.icon}/></svg>
              </div>
              <div style={{'flex': '1', 'minWidth': '0'}}>
                <p style={{'margin': '0', 'fontSize': '15px', 'fontWeight': '800', 'color': '#16231a'}}>{s.name}</p>
                <p style={{'margin': '4px 0 8px', 'fontSize': '11.5px', 'color': '#8a988c', 'fontWeight': '500', 'lineHeight': '1.45'}}>{s.desc}</p>
                <p style={{'margin': '0', 'fontSize': '11px', 'color': '#6d7d6f', 'fontWeight': '600'}}>Starts from <span style={{'fontSize': '14px', 'fontWeight': '800', 'color': '#1a5e2e'}}>{s.price}</span></p>
              </div>
              <div style={{'width': '28px', 'height': '28px', 'borderRadius': '50%', 'background': '#eef6ea', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'alignSelf': 'center', 'flex': 'none'}}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1a5e2e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              </div>
            </div>
          ))}

          <div style={{'display': 'flex', 'justifyContent': 'space-between', 'background': '#fff', 'border': '1px solid #eef3ec', 'borderRadius': '18px', 'padding': '16px 10px', 'marginTop': '4px'}}>
            { trust.map((t, index) => (
              <div style={{'flex': '1', 'display': 'flex', 'flexDirection': 'column', 'alignItems': 'center', 'gap': '7px', 'textAlign': 'center'}}>
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#1a5e2e" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d={t.icon}/></svg>
                <span style={{'fontSize': '9.5px', 'fontWeight': '600', 'color': '#6d7d6f', 'lineHeight': '1.25'}}>{t.label}</span>
              </div>
            ))}
          </div>
          <div style={{'height': '12px'}}></div>
        </div>
      </div>
      )}

      {/* ===================== CUSTOMIZE & BOOK ===================== */}
      {isCustomize && (
      <div className="rv-screen">
        <div style={{'background': 'linear-gradient(160deg,#1a5e2e 0%,#123f21 100%)', 'padding': '56px 22px 20px', 'borderRadius': '0 0 26px 26px', 'display': 'flex', 'alignItems': 'center', 'gap': '14px'}}>
          <button onClick={back} style={{'width': '38px', 'height': '38px', 'borderRadius': '12px', 'border': 'none', 'background': 'rgba(255,255,255,.14)', 'color': '#fff', 'fontSize': '18px', 'cursor': 'pointer'}}>←</button>
          <span style={{'fontSize': '18px', 'fontWeight': '800', 'color': '#fff'}}>Customize Service</span>
        </div>

        <div style={{'padding': '18px 22px 0'}}>
          <div style={{'height': '18px', 'background': svc.grad, 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center'}}>
            <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d={svc.icon}/></svg>
          </div>
          <p style={{'margin': '16px 0 4px', 'fontSize': '19px', 'fontWeight': '800', 'color': '#12351d'}}>{svc.name}</p>
          <p style={{'margin': '0', 'fontSize': '13px', 'color': '#6d7d6f', 'fontWeight': '500', 'lineHeight': '1.5'}}>{svc.long}</p>

          <div style={{'marginTop': '18px'}}>
            <label style={{'fontSize': '13px', 'fontWeight': '700', 'color': '#3d4f40'}}>{svc.measureLabel}</label>
            <div style={{'marginTop': '9px', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between', 'height': '54px', 'border': '1.5px solid #e2e8e0', 'borderRadius': '15px', 'padding': '0 8px 0 16px', 'background': '#fbfdfa'}}>
              <span style={{'fontSize': '16px', 'fontWeight': '800', 'color': '#16231a'}}>{cz.qty}</span>
              <div style={{'display': 'flex', 'gap': '8px'}}>
                <button onClick={dec} style={{'width': '38px', 'height': '38px', 'borderRadius': '11px', 'border': '1px solid #e2e8e0', 'background': '#fff', 'color': '#1a5e2e', 'fontSize': '20px', 'cursor': 'pointer'}}>−</button>
                <button onClick={inc} style={{'width': '38px', 'height': '38px', 'borderRadius': '11px', 'border': 'none', 'background': '#1a5e2e', 'color': '#fff', 'fontSize': '20px', 'cursor': 'pointer'}}>+</button>
              </div>
            </div>
          </div>

          {svc.hasOptions && (
          <div style={{'marginTop': '15px'}}>
            <label style={{'fontSize': '13px', 'fontWeight': '700', 'color': '#3d4f40'}}>{svc.optLabel}</label>
            <div style={{'marginTop': '9px', 'display': 'flex', 'alignItems': 'center', 'height': '54px', 'border': '1.5px solid #e2e8e0', 'borderRadius': '15px', 'padding': '0 16px', 'background': '#fbfdfa'}}>
              <select value={cz.opt} onChange={setOpt} style={{'flex': '1', 'border': 'none', 'background': 'transparent', 'fontFamily': 'inherit', 'fontSize': '14.5px', 'fontWeight': '700', 'color': '#16231a', 'WebkitAppearance': 'none', 'appearance': 'none', 'cursor': 'pointer'}}>
                { svc.options.map((o, index) => (<option>{o}</option>))}
              </select>
              <span style={{'color': '#8a988c'}}>▾</span>
            </div>
          </div>
          )}

          {svc.hasAddons && (
          <div style={{'marginTop': '16px', 'background': '#fff', 'border': '1px solid #eef3ec', 'borderRadius': '16px', 'padding': '4px 16px'}}>
            <div style={{'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between', 'padding': '14px 0'}}>
              <span style={{'fontSize': '14px', 'fontWeight': '600', 'color': '#16231a'}}>{svc.addon1}</span>
              <button onClick={tog1} style={{'width': '28px', 'borderRadius': '16px', 'border': 'none', 'cursor': 'pointer', 'position': 'relative', 'background': 'cz.a1track'}}>
                <span style={{'position': '3px', 'left': 'cz.a1knob', 'width': '22px', 'height': '22px', 'borderRadius': '50%', 'background': '#fff', 'boxShadow': '0'}} 2px 5px rgba(0,0,0,.2)></span>
              </button>
            </div>
            <div style={{'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between', 'padding': '14px 0', 'borderTop': '1px solid #f0f4ee'}}>
              <span style={{'fontSize': '14px', 'fontWeight': '600', 'color': '#16231a'}}>{svc.addon2}</span>
              <button onClick={tog2} style={{'width': '28px', 'borderRadius': '16px', 'border': 'none', 'cursor': 'pointer', 'position': 'relative', 'background': 'cz.a2track'}}>
                <span style={{'position': '3px', 'left': 'cz.a2knob', 'width': '22px', 'height': '22px', 'borderRadius': '50%', 'background': '#fff', 'boxShadow': '0'}} 2px 5px rgba(0,0,0,.2)></span>
              </button>
            </div>
          </div>
          )}

          <div style={{'marginTop': '16px', 'background': '#fff', 'border': '1px solid #eef3ec', 'borderRadius': '16px', 'padding': '6px 16px'}}>
            <div style={{'display': 'flex', 'justifyContent': 'space-between', 'padding': '13px 0'}}><span style={{'fontSize': '13px', 'color': '#6d7d6f', 'fontWeight': '500'}}>Estimated Time</span><span style={{'fontSize': '13px', 'color': '#16231a', 'fontWeight': '700'}}>{svc.time}</span></div>
            <div style={{'display': 'flex', 'justifyContent': 'space-between', 'padding': '13px 0', 'borderTop': '1px solid #f0f4ee'}}><span style={{'fontSize': '13px', 'color': '#6d7d6f', 'fontWeight': '500'}}>Warranty</span><span style={{'fontSize': '13px', 'color': '#16231a', 'fontWeight': '700'}}>{svc.warranty}</span></div>
          </div>

          <div style={{'marginTop': '16px', 'background': 'linear-gradient(160deg,#1a5e2e,#124423)', 'borderRadius': '18px', 'padding': '18px'}}>
            <div style={{'display': 'flex', 'alignItems': 'flex-end', 'justifyContent': 'space-between'}}>
              <div><p style={{'margin': '0', 'fontSize': '12px', 'color': '#bcd6bd', 'fontWeight': '600'}}>Total Estimate</p><p style={{'margin': '7px 0 0', 'fontSize': '26px', 'fontWeight': '800', 'color': '#fff'}}>{total}</p></div>
              <span style={{'fontSize': '10.5px', 'color': '#9cc39d', 'fontWeight': '500', 'maxWidth': '130px', 'textAlign': 'right', 'lineHeight': '1.4'}}>Inclusive of material, labour & transport</span>
            </div>
          </div>

          <button onClick={addToCart} style={{'margin': '18px 0', 'width': '100%', 'height': '56px', 'border': 'none', 'borderRadius': '16px', 'background': 'linear-gradient(180deg,#eb9236,#e2822a)', 'color': '#fff', 'fontFamily': 'inherit', 'fontSize': '15px', 'fontWeight': '700', 'cursor': 'pointer', 'boxShadow': '0 14px 26px -12px rgba(226,130,42,.6)'}}>Add to Cart · {total}</button>
        </div>
      </div>
      )}

      {/* ===================== SERVICE ADDED ===================== */}
      {isAdded && (
      <div className="rv-screen" style={{'minHeight': '820px', 'display': 'flex', 'flexDirection': 'column', 'alignItems': 'center', 'justifyContent': 'center', 'textAlign': 'center', 'padding': '40px 34px'}}>
        <div style={{'position': 'relative', 'width': '110px', 'height': '110px', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center'}}>
          <span style={{'position': 'absolute', 'inset': '0', 'borderRadius': '50%', 'background': '#1a5e2e', 'animation': 'rvRing 1.6s ease-out infinite'}}></span>
          <div style={{'position': 'relative', 'width': '100px', 'height': '100px', 'borderRadius': '50%', 'background': 'linear-gradient(180deg,#1a5e2e,#124423)', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'boxShadow': '0 18px 40px -14px rgba(18,68,35,.8)'}}>
            <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 4 10-10"/></svg>
          </div>
        </div>
        <p style={{'margin': '26px 0 8px', 'fontSize': '23px', 'fontWeight': '800', 'color': '#12351d'}}>Service Added Successfully!</p>
        <p style={{'margin': '0', 'fontSize': '14px', 'color': '#6d7d6f', 'lineHeight': '1.55', 'maxWidth': '270px'}}><strong style={{'color': '#16231a'}}>{svc.name}</strong> has been added to your orders for {sel.code}.</p>
        <div style={{'marginTop': '26px', 'background': '#f2f7ef', 'border': '1px solid #e0ebd9', 'borderRadius': '16px', 'padding': '16px 26px'}}>
          <p style={{'margin': '0', 'fontSize': '11.5px', 'color': '#8a988c', 'fontWeight': '600'}}>Order ID</p>
          <p style={{'margin': '7px 0 0', 'fontSize': '19px', 'fontWeight': '800', 'color': '#1a5e2e', 'letterSpacing': '.5px'}}>{orderId}</p>
        </div>
        <button onClick={goOrders} style={{'marginTop': '34px', 'width': '100%', 'height': '56px', 'border': 'none', 'borderRadius': '16px', 'background': 'linear-gradient(180deg,#1a5e2e,#124423)', 'color': '#fff', 'fontFamily': 'inherit', 'fontSize': '15px', 'fontWeight': '700', 'cursor': 'pointer', 'boxShadow': '0 14px 26px -12px rgba(18,68,35,.7)'}}>View My Orders</button>
        <button onClick={goLands} style={{'marginTop': '12px', 'width': '100%', 'height': '56px', 'border': '1.5px solid #cfe6c6', 'borderRadius': '16px', 'background': '#fff', 'color': '#1a5e2e', 'fontFamily': 'inherit', 'fontSize': '15px', 'fontWeight': '700', 'cursor': 'pointer'}}>Go to My Lands</button>
      </div>
      )}

      {/* ===================== ORDER TRACKING ===================== */}
      {isOrders && (
      <div className="rv-screen">
        <div style={{'background': 'linear-gradient(160deg,#1a5e2e 0%,#123f21 100%)', 'padding': '56px 22px 20px', 'borderRadius': '0 0 26px 26px', 'display': 'flex', 'alignItems': 'center', 'gap': '14px'}}>
          <button onClick={back} style={{'width': '38px', 'height': '38px', 'borderRadius': '12px', 'border': 'none', 'background': 'rgba(255,255,255,.14)', 'color': '#fff', 'fontSize': '18px', 'cursor': 'pointer'}}>←</button>
          <span style={{'fontSize': '18px', 'fontWeight': '800', 'color': '#fff'}}>My Orders · {sel.codeShort}</span>
        </div>

        <div style={{'padding': '18px 22px 0'}}>
          <div style={{'display': 'flex', 'background': '#eef3ec', 'borderRadius': '14px', 'padding': '5px', 'gap': '5px'}}>
            { orderTabs.map((t, index) => (
              <button onClick={t.pick} style={t.style}>{t.label}</button>
            ))}
          </div>

          {ordersEmpty && (
          <div style={{'display': 'flex', 'flexDirection': 'column', 'alignItems': 'center', 'textAlign': 'center', 'padding': '52px 20px'}}>
            <div style={{'width': '78px', 'height': '78px', 'borderRadius': '24px', 'background': '#eef6ea', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center'}}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8fae8c" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h9l4 4v14H6zM14 3v5h5"/></svg>
            </div>
            <p style={{'margin': '18px 0 5px', 'fontSize': '15px', 'fontWeight': '800', 'color': '#12351d'}}>{emptyOrderTitle}</p>
            <p style={{'margin': '0', 'fontSize': '12.5px', 'color': '#8a988c', 'maxWidth': '210px', 'lineHeight': '1.5'}}>{emptyOrderText}</p>
          </div>
          )}

          {ordersShow && (
          <div style={{'marginTop': '16px', 'background': '#fff', 'border': '1px solid #eef3ec', 'borderRadius': '20px', 'padding': '16px', 'boxShadow': '0 12px 30px -24px rgba(18,53,29,.5)'}}>
            <div style={{'display': 'flex', 'alignItems': 'center', 'gap': '12px', 'paddingBottom': '14px', 'borderBottom': '1px solid #f0f4ee'}}>
              <div style={{'width': '52px', 'borderRadius': '13px', 'background': order.grad, 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'flex': 'none'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d={order.icon}/></svg>
              </div>
              <div style={{'flex': '1'}}><p style={{'margin': '0', 'fontSize': '14.5px', 'fontWeight': '800', 'color': '#16231a'}}>{order.name}</p><p style={{'margin': '3px 0 0', 'fontSize': '11.5px', 'color': '#8a988c', 'fontWeight': '500'}}>Order ID: {order.id}</p></div>
              <span style={order.badgeStyle}>{order.badge}</span>
            </div>
            <div style={{'paddingTop': '16px', 'display': 'flex', 'flexDirection': 'column'}}>
              { timeline.map((tl, index) => (
                <div style={{'display': 'flex', 'gap': '14px'}}>
                  <div style={{'display': 'flex', 'flexDirection': 'column', 'alignItems': 'center'}}>
                    <span style={{'width': '24px', 'borderRadius': '50%', 'background': tl.dotBg, 'border': '2px'}} solid tl.dotBorder;display:flex;align-items:center;justify-content:center;flex:none>
                      {tl.done && (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 4 10-10"/></svg>)}
                    </span>
                    <span style={{'width': tl.lineH, 'background': tl.lineBg}}></span>
                  </div>
                  <div style={{'flex': tl.pad}}>
                    <p style={{'margin': '13.5px', 'fontWeight': '700', 'color': tl.titleColor}}>{tl.title}</p>
                    <p style={{'margin': '3px'}} 0 0;font-size:11.5px;color:tl.dateColor;font-weight:600>{tl.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button style={{'margin': '16px 0', 'width': '100%', 'height': '52px', 'border': '1.5px solid #cfe6c6', 'borderRadius': '15px', 'background': '#fff', 'color': '#1a5e2e', 'fontFamily': 'inherit', 'fontSize': '14.5px', 'fontWeight': '700', 'cursor': 'pointer', 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'gap': '8px'}}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1a5e2e" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h13a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-6l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/></svg>
            Contact Provider
          </button>
          )}
        </div>
      </div>
      )}

    </div>

    {/* ===================== MAIN NAV ===================== */}
    <nav className="rv-nav">
      <button className="rv-nav-btn" onClick={goHome}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5"/></svg>
        <span className="nav-label">Home</span>
      </button>
      <button className="rv-nav-btn" onClick={goVisitsPage}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M9 14l2 2 4-4"/></svg>
        <span className="nav-label">Site Visits</span>
      </button>
      <button className="rv-nav-btn active" onClick={goLandsPage}>
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

  </div>

  
