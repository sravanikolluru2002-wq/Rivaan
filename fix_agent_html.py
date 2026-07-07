# -*- coding: utf-8 -*-
import os
import re

path = 'frontend/public/Rivan Agent Dashboard.dc.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace kpis
kpis_def = '''    const kpis=[
      {label:'Total Leads',value:'128',delta:'+12 today ?',deltaColor:'#1a8a4a',icon:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M19 8v6M22 11h-6',iconBg:'#eef2fb',iconColor:'#2a6fdb'},
      {label:'Site Visits',value:'32',delta:'+5 today ?',deltaColor:'#1a8a4a',icon:'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',iconBg:'#eef6ea',iconColor:'#1a5e2e'},
      {label:'Bookings',value:'18',delta:'+3 today ?',deltaColor:'#1a8a4a',icon:'M6 3h9l4 4v14H6zM14 3v5h5',iconBg:'#fdf3e8',iconColor:'#e2822a'},
      {label:'Total Sales',value:'?2.45 Cr',delta:'+18% this month ?',deltaColor:'#1a8a4a',icon:'M12 3v18M8 7h6a2.5 2.5 0 0 1 0 5H9a2.5 2.5 0 0 0 0 5h7',iconBg:'#f3eefb',iconColor:'#7a4fce'},
      {label:'Commission Earned',value:'?24,56,000',delta:'+15% this month ?',deltaColor:'#1a8a4a',icon:'M6 3h12v18l-6-3-6 3z',iconBg:'#fdf3e8',iconColor:'#e2822a'},
    ];'''

kpis_rep = '''
    const ad = window.__AGENT_DATA || {};
    const d = ad.dashboard || {};
    const l = ad.leads || [];
    const b = ad.bookings || [];
    const v = ad.visits || [];
    
    const kpis=[
      {label:'Total Leads',value: d.total_leads || '128',delta:'+12 today ?',deltaColor:'#1a8a4a',icon:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M19 8v6M22 11h-6',iconBg:'#eef2fb',iconColor:'#2a6fdb'},
      {label:'Site Visits',value: d.total_visits || '32',delta:'+5 today ?',deltaColor:'#1a8a4a',icon:'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',iconBg:'#eef6ea',iconColor:'#1a5e2e'},
      {label:'Bookings',value: d.total_bookings || '18',delta:'+3 today ?',deltaColor:'#1a8a4a',icon:'M6 3h9l4 4v14H6zM14 3v5h5',iconBg:'#fdf3e8',iconColor:'#e2822a'},
      {label:'Total Sales',value: d.total_sales_val ? `?${(d.total_sales_val/100000).toFixed(1)} L` : '?2.45 Cr',delta:'+18% this month ?',deltaColor:'#1a8a4a',icon:'M12 3v18M8 7h6a2.5 2.5 0 0 1 0 5H9a2.5 2.5 0 0 0 0 5h7',iconBg:'#f3eefb',iconColor:'#7a4fce'},
      {label:'Commission Earned',value: d.total_comm ? `?${d.total_comm.toLocaleString()}` : '?24,56,000',delta:'+15% this month ?',deltaColor:'#1a8a4a',icon:'M6 3h12v18l-6-3-6 3z',iconBg:'#fdf3e8',iconColor:'#e2822a'},
    ];'''
content = content.replace(kpis_def, kpis_rep)

cust_def = '''    const CUST=[
      {name:'Rohan Verma',phone:'+91 98765 43210',project:'Emerald Estate',type:'Villa Plot',status:'Lead',stype:'lead',lastContact:'21 May 2025',nextFollow:'24 May 2025',email:'rohan.verma@gmail.com',city:'Visakhapatnam',occ:'Software Engineer',budget:'?45 – 55 L',loc:'Madhurawada'},
      {name:'Anita Sharma',phone:'+91 91234 56789',project:'Green City Enclave',type:'Plot',status:'Site Visit',stype:'visit',lastContact:'20 May 2025',nextFollow:'23 May 2025',email:'anita.sharma@gmail.com',city:'Anakapalle',occ:'Doctor',budget:'?30 – 40 L',loc:'Anakapalle'},
      {name:'Vikram Reddy',phone:'+91 99887 66554',project:'Sunrise Valley',type:'Villa',status:'Interested',stype:'interested',lastContact:'19 May 2025',nextFollow:'22 May 2025',email:'vikram.reddy@gmail.com',city:'Vizag',occ:'Business Owner',budget:'?80 L – 1 Cr',loc:'Yendada'},
      {name:'Neha Patel',phone:'+91 87654 32109',project:'Emerald Heights',type:'Apartment',status:'Booked',stype:'booked',lastContact:'18 May 2025',nextFollow:'25 May 2025',email:'neha.patel@gmail.com',city:'Visakhapatnam',occ:'Architect',budget:'?60 – 70 L',loc:'Seethammadhara'},
      {name:'Arjun Mehta',phone:'+91 76543 21098',project:'Green Valley Farms',type:'Farm Plot',status:'Booked',stype:'booked',lastContact:'17 May 2025',nextFollow:'26 May 2025',email:'arjun.mehta@gmail.com',city:'Bheemili',occ:'Consultant',budget:'?25 – 35 L',loc:'Bheemili'},
      {name:'Priya Nair',phone:'+91 90123 45678',project:'Emerald Estate',type:'Villa Plot',status:'Lead',stype:'lead',lastContact:'16 May 2025',nextFollow:'23 May 2025',email:'priya.nair@gmail.com',city:'Vizag',occ:'Marketing Lead',budget:'?50 – 60 L',loc:'MVP Colony'},
    ];'''

cust_rep = '''    const _def_cust = [
      {name:'Rohan Verma',phone:'+91 98765 43210',project:'Emerald Estate',type:'Villa Plot',status:'Lead',stype:'lead',lastContact:'21 May 2025',nextFollow:'24 May 2025',email:'rohan.verma@gmail.com',city:'Visakhapatnam',occ:'Software Engineer',budget:'?45 – 55 L',loc:'Madhurawada'},
      {name:'Anita Sharma',phone:'+91 91234 56789',project:'Green City Enclave',type:'Plot',status:'Site Visit',stype:'visit',lastContact:'20 May 2025',nextFollow:'23 May 2025',email:'anita.sharma@gmail.com',city:'Anakapalle',occ:'Doctor',budget:'?30 – 40 L',loc:'Anakapalle'}
    ];
    const CUST = l.length > 0 ? l.map(lead => ({
      name: lead.name || 'Unnamed',
      phone: lead.phone || 'N/A',
      project: lead.property_id || 'Unknown',
      type: 'Plot',
      status: lead.status || 'Lead',
      stype: (lead.status || '').toLowerCase() === 'booked' ? 'booked' : 'lead',
      lastContact: new Date(lead.updated_at || Date.now()).toLocaleDateString(),
      nextFollow: 'TBD',
      email: lead.email || '',
      city: 'Unknown',
      occ: 'Unknown',
      budget: 'TBD',
      loc: 'Unknown'
    })) : _def_cust;'''
content = content.replace(cust_def, cust_rep)

vr_def = '''    const VR=[
      ['Rohan Verma','Emerald Estate','23 May, 10:00 AM','Pending','pending','A-120'],
      ['Anita Sharma','Green City Enclave','23 May, 02:00 PM','Confirmed','confirmed','B-45'],
      ['Vikram Reddy','Sunrise Valley','24 May, 11:00 AM','Pending','pending','C-23'],
      ['Neha Patel','Emerald Heights','24 May, 04:00 PM','Confirmed','confirmed','D-12'],
      ['Arjun Mehta','Green Valley Farms','25 May, 10:30 AM','Pending','pending','F-08'],
    ];'''

vr_rep = '''    const _def_vr = [
      ['Rohan Verma','Emerald Estate','23 May, 10:00 AM','Pending','pending','A-120'],
      ['Anita Sharma','Green City Enclave','23 May, 02:00 PM','Confirmed','confirmed','B-45'],
    ];
    const VR = v.length > 0 ? v.map(visit => [
      visit.customer_name || 'Customer',
      visit.property_name || 'Property',
      new Date(visit.scheduled_at || Date.now()).toLocaleString(),
      visit.status || 'Pending',
      (visit.status || 'pending').toLowerCase(),
      visit.plot_id || 'TBD'
    ]) : _def_vr;'''
content = content.replace(vr_def, vr_rep)

rb_def = '''    const recentBookings=[
      ['Rohan Verma','Emerald Estate','A-120','21 May 2025','?2.5 L','Confirmed','confirmed'],
      ['Vikram Reddy','Sunrise Valley','C-23','19 May 2025','?5.0 L','Confirmed','confirmed'],
      ['Anita Sharma','Green City Enclave','B-45','18 May 2025','?1.0 L','Pending','pending'],
      ['Neha Patel','Emerald Heights','D-12','15 May 2025','?1.5 L','Confirmed','confirmed'],
      ['Arjun Mehta','Green Valley Farms','F-08','12 May 2025','?0.5 L','Failed','failed'],
    ];'''

rb_rep = '''    const _def_rb=[
      ['Rohan Verma','Emerald Estate','A-120','21 May 2025','?2.5 L','Confirmed','confirmed'],
      ['Vikram Reddy','Sunrise Valley','C-23','19 May 2025','?5.0 L','Confirmed','confirmed']
    ];
    const recentBookings = b.length > 0 ? b.map(bk => [
      bk.customer_name || 'Customer',
      bk.property_name || 'Property',
      bk.plot_id || 'TBD',
      new Date(bk.created_at || Date.now()).toLocaleDateString(),
      'TBD',
      bk.status || 'Confirmed',
      (bk.status || 'confirmed').toLowerCase()
    ]) : _def_rb;'''
content = content.replace(rb_def, rb_rep)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Agent html replaced!")
