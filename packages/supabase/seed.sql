-- ============================================
-- YouTube Studio Clone - Seed Data
-- ============================================

-- Channel
INSERT INTO channel (id, name, handle, avatar_url, banner_url, description, subscriber_count, total_views, total_watch_time_hours, video_count, country, joined_date, is_verified)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'TechVision Pro',
  '@TechVisionPro',
  'https://picsum.photos/seed/avatar/200/200',
  'https://picsum.photos/seed/banner/1280/320',
  'Welcome to TechVision Pro! We create in-depth tech reviews, tutorials, and industry analysis. New videos every week.',
  152400,
  12450000,
  845200.5,
  127,
  'US',
  '2019-06-15',
  true
);

-- Videos
INSERT INTO videos (id, channel_id, title, description, thumbnail_url, duration, status, visibility, published_at, view_count, like_count, dislike_count, comment_count, share_count, watch_time_hours, average_view_duration, impressions, impression_ctr, estimated_revenue, rpm, cpm, retention_data, traffic_sources, audience_geography, audience_age_gender, sort_order) VALUES
('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'iPhone 16 Pro Max - Complete Review After 30 Days', 'Full review of the iPhone 16 Pro Max after using it for a month.', 'https://picsum.photos/seed/vid1/640/360', '18:42', 'published', 'public', '2026-03-01 10:00:00+00', 485200, 18400, 320, 2150, 3400, 42500.5, '8:15', 1250000, 4.85, 2450.00, 5.05, 7.20,
'[{"second":0,"percentage":100},{"second":30,"percentage":92},{"second":60,"percentage":85},{"second":120,"percentage":72},{"second":300,"percentage":58},{"second":600,"percentage":42},{"second":900,"percentage":28}]',
'[{"source":"YouTube Search","percentage":35,"views":169820},{"source":"Suggested Videos","percentage":28,"views":135856},{"source":"Browse Features","percentage":22,"views":106744},{"source":"External","percentage":10,"views":48520},{"source":"Other","percentage":5,"views":24260}]',
'[{"country":"US","percentage":42},{"country":"UK","percentage":12},{"country":"IN","percentage":10},{"country":"CA","percentage":8},{"country":"DE","percentage":6},{"country":"BR","percentage":5},{"country":"Other","percentage":17}]',
'[{"range":"13-17","male":8,"female":4},{"range":"18-24","male":22,"female":12},{"range":"25-34","male":25,"female":10},{"range":"35-44","male":10,"female":4},{"range":"45-54","male":3,"female":1},{"range":"55+","male":1,"female":0}]',
1),

('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Best Budget Laptops 2026 - Top 5 Picks', 'Our top 5 budget laptop recommendations for 2026.', 'https://picsum.photos/seed/vid2/640/360', '22:15', 'published', 'public', '2026-02-20 14:00:00+00', 324500, 12300, 180, 980, 2100, 35200.0, '10:22', 890000, 4.12, 1680.50, 5.18, 6.90,
'[{"second":0,"percentage":100},{"second":30,"percentage":94},{"second":60,"percentage":88},{"second":120,"percentage":75},{"second":300,"percentage":62},{"second":600,"percentage":48},{"second":900,"percentage":35}]',
'[{"source":"YouTube Search","percentage":42,"views":136290},{"source":"Suggested Videos","percentage":25,"views":81125},{"source":"Browse Features","percentage":18,"views":58410},{"source":"External","percentage":8,"views":25960},{"source":"Other","percentage":7,"views":22715}]',
'[{"country":"US","percentage":38},{"country":"IN","percentage":15},{"country":"UK","percentage":10},{"country":"CA","percentage":7},{"country":"AU","percentage":5},{"country":"Other","percentage":25}]',
'[{"range":"13-17","male":10,"female":5},{"range":"18-24","male":28,"female":14},{"range":"25-34","male":20,"female":8},{"range":"35-44","male":8,"female":3},{"range":"45-54","male":2,"female":1},{"range":"55+","male":1,"female":0}]',
2),

('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'How to Build a PC in 2026 - Complete Guide', 'Step by step PC building guide for beginners and enthusiasts.', 'https://picsum.photos/seed/vid3/640/360', '35:10', 'published', 'public', '2026-02-10 08:00:00+00', 892000, 34500, 420, 4200, 8900, 125000.0, '15:45', 2100000, 5.20, 5200.00, 5.83, 8.10,
'[{"second":0,"percentage":100},{"second":30,"percentage":96},{"second":60,"percentage":90},{"second":120,"percentage":82},{"second":300,"percentage":68},{"second":600,"percentage":55},{"second":1200,"percentage":40},{"second":1800,"percentage":28}]',
'[{"source":"YouTube Search","percentage":48,"views":428160},{"source":"Suggested Videos","percentage":22,"views":196240},{"source":"Browse Features","percentage":15,"views":133800},{"source":"External","percentage":12,"views":107040},{"source":"Other","percentage":3,"views":26760}]',
'[{"country":"US","percentage":35},{"country":"IN","percentage":18},{"country":"UK","percentage":9},{"country":"DE","percentage":7},{"country":"CA","percentage":6},{"country":"BR","percentage":5},{"country":"Other","percentage":20}]',
'[{"range":"13-17","male":15,"female":5},{"range":"18-24","male":30,"female":10},{"range":"25-34","male":22,"female":6},{"range":"35-44","male":7,"female":2},{"range":"45-54","male":2,"female":1},{"range":"55+","male":0,"female":0}]',
3),

('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Samsung Galaxy S26 Ultra vs iPhone 16 Pro Max', 'The ultimate flagship comparison of 2026.', 'https://picsum.photos/seed/vid4/640/360', '24:30', 'published', 'public', '2026-03-10 12:00:00+00', 218000, 9800, 250, 1800, 1500, 18500.0, '9:30', 680000, 3.95, 1120.00, 5.14, 7.00,
'[{"second":0,"percentage":100},{"second":30,"percentage":90},{"second":60,"percentage":82},{"second":120,"percentage":70},{"second":300,"percentage":55},{"second":600,"percentage":38},{"second":900,"percentage":22}]',
'[{"source":"YouTube Search","percentage":40,"views":87200},{"source":"Suggested Videos","percentage":30,"views":65400},{"source":"Browse Features","percentage":16,"views":34880},{"source":"External","percentage":9,"views":19620},{"source":"Other","percentage":5,"views":10900}]',
'[{"country":"US","percentage":40},{"country":"UK","percentage":11},{"country":"IN","percentage":12},{"country":"CA","percentage":7},{"country":"DE","percentage":5},{"country":"Other","percentage":25}]',
'[{"range":"18-24","male":25,"female":12},{"range":"25-34","male":28,"female":10},{"range":"35-44","male":12,"female":5},{"range":"45-54","male":5,"female":2},{"range":"55+","male":1,"female":0}]',
4),

('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'MacBook Pro M4 Max - Is It Worth the Upgrade?', 'Testing the new MacBook Pro with M4 Max chip.', 'https://picsum.photos/seed/vid5/640/360', '20:18', 'published', 'public', '2026-01-25 16:00:00+00', 567000, 22100, 310, 3100, 4200, 52000.0, '11:05', 1450000, 4.65, 3100.00, 5.47, 7.50,
'[{"second":0,"percentage":100},{"second":30,"percentage":93},{"second":60,"percentage":87},{"second":120,"percentage":76},{"second":300,"percentage":60},{"second":600,"percentage":45},{"second":900,"percentage":30}]',
'[{"source":"YouTube Search","percentage":38,"views":215460},{"source":"Suggested Videos","percentage":27,"views":153090},{"source":"Browse Features","percentage":20,"views":113400},{"source":"External","percentage":10,"views":56700},{"source":"Other","percentage":5,"views":28350}]',
'[{"country":"US","percentage":45},{"country":"UK","percentage":10},{"country":"CA","percentage":9},{"country":"DE","percentage":6},{"country":"JP","percentage":5},{"country":"Other","percentage":25}]',
'[{"range":"18-24","male":20,"female":10},{"range":"25-34","male":30,"female":12},{"range":"35-44","male":15,"female":5},{"range":"45-54","male":5,"female":2},{"range":"55+","male":1,"female":0}]',
5),

('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'Top 10 VS Code Extensions You NEED in 2026', 'Essential VS Code extensions for developers.', 'https://picsum.photos/seed/vid6/640/360', '14:55', 'published', 'public', '2026-03-15 09:00:00+00', 145000, 7800, 90, 620, 1800, 9800.0, '6:40', 520000, 3.80, 720.00, 4.97, 6.50,
'[{"second":0,"percentage":100},{"second":30,"percentage":88},{"second":60,"percentage":80},{"second":120,"percentage":68},{"second":300,"percentage":50},{"second":600,"percentage":32}]',
'[{"source":"YouTube Search","percentage":50,"views":72500},{"source":"Suggested Videos","percentage":20,"views":29000},{"source":"Browse Features","percentage":18,"views":26100},{"source":"External","percentage":8,"views":11600},{"source":"Other","percentage":4,"views":5800}]',
'[{"country":"US","percentage":30},{"country":"IN","percentage":22},{"country":"UK","percentage":8},{"country":"BR","percentage":7},{"country":"DE","percentage":5},{"country":"Other","percentage":28}]',
'[{"range":"18-24","male":30,"female":12},{"range":"25-34","male":32,"female":10},{"range":"35-44","male":10,"female":3},{"range":"45-54","male":2,"female":1}]',
6),

('10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', 'Why I Switched from Windows to Linux (Full Time)', 'My experience switching to Linux as a daily driver.', 'https://picsum.photos/seed/vid7/640/360', '16:28', 'published', 'public', '2026-03-20 11:00:00+00', 78500, 5200, 180, 890, 950, 5600.0, '7:12', 320000, 3.45, 380.00, 4.84, 6.20,
'[{"second":0,"percentage":100},{"second":30,"percentage":91},{"second":60,"percentage":84},{"second":120,"percentage":72},{"second":300,"percentage":55},{"second":600,"percentage":38}]',
'[{"source":"YouTube Search","percentage":30,"views":23550},{"source":"Suggested Videos","percentage":35,"views":27475},{"source":"Browse Features","percentage":20,"views":15700},{"source":"External","percentage":10,"views":7850},{"source":"Other","percentage":5,"views":3925}]',
'[{"country":"US","percentage":32},{"country":"DE","percentage":14},{"country":"IN","percentage":12},{"country":"UK","percentage":9},{"country":"BR","percentage":6},{"country":"Other","percentage":27}]',
'[{"range":"18-24","male":28,"female":8},{"range":"25-34","male":35,"female":8},{"range":"35-44","male":12,"female":3},{"range":"45-54","male":4,"female":1},{"range":"55+","male":1,"female":0}]',
7),

('10000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001', 'Upcoming Video: AI Tools Deep Dive', 'Coming soon - a comprehensive look at AI tools for creators.', 'https://picsum.photos/seed/vid8/640/360', '0:00', 'draft', 'private', NULL, 0, 0, 0, 0, 0, 0, '0:00', 0, 0, 0, 0, 0, '[]', '[]', '[]', '[]', 8),

('10000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000001', 'Members Only: Behind the Scenes of Our Studio Setup', 'Exclusive look at our production setup.', 'https://picsum.photos/seed/vid9/640/360', '12:05', 'published', 'unlisted', '2026-02-28 18:00:00+00', 8200, 920, 5, 180, 120, 680.0, '8:30', 12000, 8.50, 45.00, 5.49, 7.80, '[]', '[]', '[]', '[]', 9),

('10000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'Quick Tips: 5 Hidden iPhone Features', 'Short tips video about hidden iPhone features.', 'https://picsum.photos/seed/vid10/640/360', '8:22', 'published', 'public', '2026-03-22 15:00:00+00', 42300, 3100, 45, 280, 890, 2800.0, '5:15', 185000, 4.10, 210.00, 4.96, 6.30,
'[{"second":0,"percentage":100},{"second":30,"percentage":90},{"second":60,"percentage":82},{"second":120,"percentage":70},{"second":300,"percentage":50},{"second":480,"percentage":35}]',
'[{"source":"YouTube Search","percentage":45,"views":19035},{"source":"Suggested Videos","percentage":25,"views":10575},{"source":"Browse Features","percentage":18,"views":7614},{"source":"External","percentage":7,"views":2961},{"source":"Other","percentage":5,"views":2115}]',
'[{"country":"US","percentage":44},{"country":"UK","percentage":12},{"country":"CA","percentage":8},{"country":"AU","percentage":6},{"country":"Other","percentage":30}]',
'[{"range":"18-24","male":22,"female":15},{"range":"25-34","male":25,"female":14},{"range":"35-44","male":10,"female":6},{"range":"45-54","male":4,"female":2},{"range":"55+","male":1,"female":1}]',
10);

-- Comments
INSERT INTO comments (video_id, author_name, author_avatar_url, content, like_count, is_hearted, is_pinned, status, published_at) VALUES
('10000000-0000-0000-0000-000000000001', 'Alex Tech', 'https://picsum.photos/seed/user1/40/40', 'Best iPhone review I''ve seen! The camera comparison was incredibly detailed. 🔥', 245, true, true, 'published', '2026-03-02 08:30:00+00'),
('10000000-0000-0000-0000-000000000001', 'Sarah Chen', 'https://picsum.photos/seed/user2/40/40', 'I was on the fence about upgrading, but this review convinced me. Thanks!', 89, true, false, 'published', '2026-03-02 10:15:00+00'),
('10000000-0000-0000-0000-000000000001', 'Mike Johnson', 'https://picsum.photos/seed/user3/40/40', 'Can you do a comparison with the Pixel 9 Pro? Would love to see that!', 156, false, false, 'published', '2026-03-02 14:22:00+00'),
('10000000-0000-0000-0000-000000000001', 'TechNerd42', 'https://picsum.photos/seed/user4/40/40', 'The battery test results are amazing. 30 days of real use data > synthetic benchmarks', 78, false, false, 'published', '2026-03-03 09:45:00+00'),
('10000000-0000-0000-0000-000000000001', 'Lisa Park', 'https://picsum.photos/seed/user5/40/40', 'First!!! Great video as always 👏', 12, false, false, 'published', '2026-03-01 10:02:00+00'),

('10000000-0000-0000-0000-000000000002', 'Budget Builder', 'https://picsum.photos/seed/user6/40/40', 'Finally a budget laptop guide that actually recommends good laptops! The Acer pick was spot on.', 134, true, false, 'published', '2026-02-21 06:30:00+00'),
('10000000-0000-0000-0000-000000000002', 'College Student', 'https://picsum.photos/seed/user7/40/40', 'Just bought the #2 pick thanks to this video. Arriving tomorrow! 🎉', 67, false, false, 'published', '2026-02-22 18:00:00+00'),
('10000000-0000-0000-0000-000000000002', 'Dave Rodriguez', 'https://picsum.photos/seed/user8/40/40', 'Would have been nice to include Chromebooks in this list', 23, false, false, 'published', '2026-02-23 12:30:00+00'),

('10000000-0000-0000-0000-000000000003', 'PC Master Race', 'https://picsum.photos/seed/user9/40/40', 'Built my first PC following this guide. Everything worked perfectly! Thank you so much! 🖥️', 312, true, true, 'published', '2026-02-11 08:00:00+00'),
('10000000-0000-0000-0000-000000000003', 'Hardware Geek', 'https://picsum.photos/seed/user10/40/40', 'Great guide but you forgot to mention thermal paste application techniques', 89, false, false, 'published', '2026-02-11 14:20:00+00'),
('10000000-0000-0000-0000-000000000003', 'Emily Zhang', 'https://picsum.photos/seed/user11/40/40', 'The cable management section was SO helpful. My build looks clean now.', 156, true, false, 'published', '2026-02-12 10:30:00+00'),
('10000000-0000-0000-0000-000000000003', 'NewToPC', 'https://picsum.photos/seed/user12/40/40', 'I''m nervous about building my first PC. Any tips for absolute beginners?', 45, false, false, 'published', '2026-02-13 16:45:00+00'),
('10000000-0000-0000-0000-000000000003', 'Tom Builder', 'https://picsum.photos/seed/user13/40/40', 'What PSU would you recommend for this build? The one in the video seems overkill.', 34, false, false, 'published', '2026-02-14 09:15:00+00'),

('10000000-0000-0000-0000-000000000004', 'Android Fan', 'https://picsum.photos/seed/user14/40/40', 'Samsung wins in customization, Apple wins in optimization. Fair comparison! 👍', 198, false, false, 'published', '2026-03-11 07:00:00+00'),
('10000000-0000-0000-0000-000000000004', 'Apple User', 'https://picsum.photos/seed/user15/40/40', 'Switched from Samsung to iPhone last year and never looked back', 87, false, false, 'published', '2026-03-11 11:30:00+00'),

('10000000-0000-0000-0000-000000000005', 'Creative Pro', 'https://picsum.photos/seed/user16/40/40', 'The M4 Max handles 8K ProRes like butter. Absolutely worth the upgrade for video editors.', 267, true, false, 'published', '2026-01-26 08:00:00+00'),
('10000000-0000-0000-0000-000000000005', 'Developer Dan', 'https://picsum.photos/seed/user17/40/40', 'Compile times are insane on this machine. My projects build 3x faster than my M1 Max.', 189, false, false, 'published', '2026-01-27 14:30:00+00'),
('10000000-0000-0000-0000-000000000005', 'Music Producer', 'https://picsum.photos/seed/user18/40/40', 'Can it handle 200+ tracks in Logic Pro without breaking a sweat? 🎵', 78, false, false, 'published', '2026-01-28 10:00:00+00'),

('10000000-0000-0000-0000-000000000006', 'VSCode Lover', 'https://picsum.photos/seed/user19/40/40', 'Extension #3 changed my workflow completely. How did I not know about this?!', 92, true, false, 'published', '2026-03-16 06:00:00+00'),
('10000000-0000-0000-0000-000000000006', 'Vim User', 'https://picsum.photos/seed/user20/40/40', 'Cool extensions but have you tried Neovim? 😏', 45, false, false, 'published', '2026-03-16 09:30:00+00'),

('10000000-0000-0000-0000-000000000007', 'Linux Penguin', 'https://picsum.photos/seed/user21/40/40', 'Welcome to the Linux gang! 🐧 You''ll never go back.', 134, false, false, 'published', '2026-03-21 07:00:00+00'),
('10000000-0000-0000-0000-000000000007', 'Windows User', 'https://picsum.photos/seed/user22/40/40', 'Honest question: how do you deal with gaming on Linux?', 67, false, false, 'published', '2026-03-21 12:45:00+00'),

-- Held for review comments
('10000000-0000-0000-0000-000000000001', 'SpamBot3000', 'https://picsum.photos/seed/spam1/40/40', 'Check out my channel for FREE iPhones!!!', 0, false, false, 'held_for_review', '2026-03-04 02:00:00+00'),
('10000000-0000-0000-0000-000000000003', 'SusAccount', 'https://picsum.photos/seed/spam2/40/40', 'Great video! Visit my profile for exclusive deals 💰💰💰', 0, false, false, 'held_for_review', '2026-02-15 04:30:00+00'),

('10000000-0000-0000-0000-000000000010', 'Quick Tips Fan', 'https://picsum.photos/seed/user23/40/40', 'Tip #3 blew my mind! I had no idea you could do that!', 56, true, false, 'published', '2026-03-23 08:00:00+00');

-- Dashboard Stats
INSERT INTO dashboard_stats (channel_id, period, views, views_change_percent, watch_time_hours, watch_time_change_percent, subscribers_gained, subscribers_lost, subscribers_net, subscribers_change_percent, estimated_revenue, revenue_change_percent, impressions, impression_ctr) VALUES
('00000000-0000-0000-0000-000000000001', 'last_7_days', 125400, 8.5, 8900.5, 6.2, 1850, 120, 1730, 12.4, 680.50, 5.8, 420000, 4.25),
('00000000-0000-0000-0000-000000000001', 'last_28_days', 485000, 12.3, 35200.0, 10.8, 6200, 380, 5820, 15.2, 2450.00, 14.5, 1580000, 4.42),
('00000000-0000-0000-0000-000000000001', 'last_90_days', 1250000, 18.7, 98500.0, 15.4, 18500, 1200, 17300, 22.1, 7200.00, 20.3, 4200000, 4.35),
('00000000-0000-0000-0000-000000000001', 'lifetime', 12450000, 0, 845200.5, 0, 152400, 0, 152400, 0, 68500.00, 0, 42000000, 4.15);

-- Analytics Timeseries (last 30 days of data)
INSERT INTO analytics_timeseries (channel_id, date, metric_type, value) VALUES
-- Views
('00000000-0000-0000-0000-000000000001', '2026-02-25', 'views', 15200),
('00000000-0000-0000-0000-000000000001', '2026-02-26', 'views', 14800),
('00000000-0000-0000-0000-000000000001', '2026-02-27', 'views', 16500),
('00000000-0000-0000-0000-000000000001', '2026-02-28', 'views', 18200),
('00000000-0000-0000-0000-000000000001', '2026-03-01', 'views', 28500),
('00000000-0000-0000-0000-000000000001', '2026-03-02', 'views', 32100),
('00000000-0000-0000-0000-000000000001', '2026-03-03', 'views', 25400),
('00000000-0000-0000-0000-000000000001', '2026-03-04', 'views', 19800),
('00000000-0000-0000-0000-000000000001', '2026-03-05', 'views', 17600),
('00000000-0000-0000-0000-000000000001', '2026-03-06', 'views', 16200),
('00000000-0000-0000-0000-000000000001', '2026-03-07', 'views', 15800),
('00000000-0000-0000-0000-000000000001', '2026-03-08', 'views', 14500),
('00000000-0000-0000-0000-000000000001', '2026-03-09', 'views', 13900),
('00000000-0000-0000-0000-000000000001', '2026-03-10', 'views', 22400),
('00000000-0000-0000-0000-000000000001', '2026-03-11', 'views', 24800),
('00000000-0000-0000-0000-000000000001', '2026-03-12', 'views', 20100),
('00000000-0000-0000-0000-000000000001', '2026-03-13', 'views', 17500),
('00000000-0000-0000-0000-000000000001', '2026-03-14', 'views', 16800),
('00000000-0000-0000-0000-000000000001', '2026-03-15', 'views', 19200),
('00000000-0000-0000-0000-000000000001', '2026-03-16', 'views', 21500),
('00000000-0000-0000-0000-000000000001', '2026-03-17', 'views', 18900),
('00000000-0000-0000-0000-000000000001', '2026-03-18', 'views', 16400),
('00000000-0000-0000-0000-000000000001', '2026-03-19', 'views', 15200),
('00000000-0000-0000-0000-000000000001', '2026-03-20', 'views', 17800),
('00000000-0000-0000-0000-000000000001', '2026-03-21', 'views', 19500),
('00000000-0000-0000-0000-000000000001', '2026-03-22', 'views', 21200),
('00000000-0000-0000-0000-000000000001', '2026-03-23', 'views', 18400),
('00000000-0000-0000-0000-000000000001', '2026-03-24', 'views', 16900),
('00000000-0000-0000-0000-000000000001', '2026-03-25', 'views', 17200),
('00000000-0000-0000-0000-000000000001', '2026-03-26', 'views', 18800),
-- Watch Time
('00000000-0000-0000-0000-000000000001', '2026-02-25', 'watch_time', 1080),
('00000000-0000-0000-0000-000000000001', '2026-02-26', 'watch_time', 1050),
('00000000-0000-0000-0000-000000000001', '2026-02-27', 'watch_time', 1180),
('00000000-0000-0000-0000-000000000001', '2026-02-28', 'watch_time', 1290),
('00000000-0000-0000-0000-000000000001', '2026-03-01', 'watch_time', 2020),
('00000000-0000-0000-0000-000000000001', '2026-03-02', 'watch_time', 2280),
('00000000-0000-0000-0000-000000000001', '2026-03-03', 'watch_time', 1800),
('00000000-0000-0000-0000-000000000001', '2026-03-04', 'watch_time', 1400),
('00000000-0000-0000-0000-000000000001', '2026-03-05', 'watch_time', 1250),
('00000000-0000-0000-0000-000000000001', '2026-03-06', 'watch_time', 1150),
('00000000-0000-0000-0000-000000000001', '2026-03-07', 'watch_time', 1120),
('00000000-0000-0000-0000-000000000001', '2026-03-08', 'watch_time', 1030),
('00000000-0000-0000-0000-000000000001', '2026-03-09', 'watch_time', 990),
('00000000-0000-0000-0000-000000000001', '2026-03-10', 'watch_time', 1590),
('00000000-0000-0000-0000-000000000001', '2026-03-11', 'watch_time', 1760),
('00000000-0000-0000-0000-000000000001', '2026-03-12', 'watch_time', 1430),
('00000000-0000-0000-0000-000000000001', '2026-03-13', 'watch_time', 1240),
('00000000-0000-0000-0000-000000000001', '2026-03-14', 'watch_time', 1190),
('00000000-0000-0000-0000-000000000001', '2026-03-15', 'watch_time', 1360),
('00000000-0000-0000-0000-000000000001', '2026-03-16', 'watch_time', 1530),
('00000000-0000-0000-0000-000000000001', '2026-03-17', 'watch_time', 1340),
('00000000-0000-0000-0000-000000000001', '2026-03-18', 'watch_time', 1160),
('00000000-0000-0000-0000-000000000001', '2026-03-19', 'watch_time', 1080),
('00000000-0000-0000-0000-000000000001', '2026-03-20', 'watch_time', 1260),
('00000000-0000-0000-0000-000000000001', '2026-03-21', 'watch_time', 1380),
('00000000-0000-0000-0000-000000000001', '2026-03-22', 'watch_time', 1500),
('00000000-0000-0000-0000-000000000001', '2026-03-23', 'watch_time', 1310),
('00000000-0000-0000-0000-000000000001', '2026-03-24', 'watch_time', 1200),
('00000000-0000-0000-0000-000000000001', '2026-03-25', 'watch_time', 1220),
('00000000-0000-0000-0000-000000000001', '2026-03-26', 'watch_time', 1340),
-- Subscribers
('00000000-0000-0000-0000-000000000001', '2026-02-25', 'subscribers', 180),
('00000000-0000-0000-0000-000000000001', '2026-02-26', 'subscribers', 165),
('00000000-0000-0000-0000-000000000001', '2026-02-27', 'subscribers', 195),
('00000000-0000-0000-0000-000000000001', '2026-02-28', 'subscribers', 210),
('00000000-0000-0000-0000-000000000001', '2026-03-01', 'subscribers', 380),
('00000000-0000-0000-0000-000000000001', '2026-03-02', 'subscribers', 420),
('00000000-0000-0000-0000-000000000001', '2026-03-03', 'subscribers', 310),
('00000000-0000-0000-0000-000000000001', '2026-03-04', 'subscribers', 220),
('00000000-0000-0000-0000-000000000001', '2026-03-05', 'subscribers', 195),
('00000000-0000-0000-0000-000000000001', '2026-03-06', 'subscribers', 180),
('00000000-0000-0000-0000-000000000001', '2026-03-07', 'subscribers', 170),
('00000000-0000-0000-0000-000000000001', '2026-03-08', 'subscribers', 155),
('00000000-0000-0000-0000-000000000001', '2026-03-09', 'subscribers', 148),
('00000000-0000-0000-0000-000000000001', '2026-03-10', 'subscribers', 290),
('00000000-0000-0000-0000-000000000001', '2026-03-11', 'subscribers', 320),
('00000000-0000-0000-0000-000000000001', '2026-03-12', 'subscribers', 245),
('00000000-0000-0000-0000-000000000001', '2026-03-13', 'subscribers', 200),
('00000000-0000-0000-0000-000000000001', '2026-03-14', 'subscribers', 190),
('00000000-0000-0000-0000-000000000001', '2026-03-15', 'subscribers', 230),
('00000000-0000-0000-0000-000000000001', '2026-03-16', 'subscribers', 260),
('00000000-0000-0000-0000-000000000001', '2026-03-17', 'subscribers', 215),
('00000000-0000-0000-0000-000000000001', '2026-03-18', 'subscribers', 185),
('00000000-0000-0000-0000-000000000001', '2026-03-19', 'subscribers', 170),
('00000000-0000-0000-0000-000000000001', '2026-03-20', 'subscribers', 205),
('00000000-0000-0000-0000-000000000001', '2026-03-21', 'subscribers', 225),
('00000000-0000-0000-0000-000000000001', '2026-03-22', 'subscribers', 250),
('00000000-0000-0000-0000-000000000001', '2026-03-23', 'subscribers', 210),
('00000000-0000-0000-0000-000000000001', '2026-03-24', 'subscribers', 190),
('00000000-0000-0000-0000-000000000001', '2026-03-25', 'subscribers', 195),
('00000000-0000-0000-0000-000000000001', '2026-03-26', 'subscribers', 215),
-- Revenue
('00000000-0000-0000-0000-000000000001', '2026-02-25', 'revenue', 72.50),
('00000000-0000-0000-0000-000000000001', '2026-02-26', 'revenue', 68.20),
('00000000-0000-0000-0000-000000000001', '2026-02-27', 'revenue', 78.90),
('00000000-0000-0000-0000-000000000001', '2026-02-28', 'revenue', 85.40),
('00000000-0000-0000-0000-000000000001', '2026-03-01', 'revenue', 142.30),
('00000000-0000-0000-0000-000000000001', '2026-03-02', 'revenue', 158.50),
('00000000-0000-0000-0000-000000000001', '2026-03-03', 'revenue', 125.80),
('00000000-0000-0000-0000-000000000001', '2026-03-04', 'revenue', 95.20),
('00000000-0000-0000-0000-000000000001', '2026-03-05', 'revenue', 84.60),
('00000000-0000-0000-0000-000000000001', '2026-03-06', 'revenue', 78.40),
('00000000-0000-0000-0000-000000000001', '2026-03-07', 'revenue', 75.80),
('00000000-0000-0000-0000-000000000001', '2026-03-08', 'revenue', 69.50),
('00000000-0000-0000-0000-000000000001', '2026-03-09', 'revenue', 66.80),
('00000000-0000-0000-0000-000000000001', '2026-03-10', 'revenue', 112.40),
('00000000-0000-0000-0000-000000000001', '2026-03-11', 'revenue', 124.80),
('00000000-0000-0000-0000-000000000001', '2026-03-12', 'revenue', 98.50),
('00000000-0000-0000-0000-000000000001', '2026-03-13', 'revenue', 85.20),
('00000000-0000-0000-0000-000000000001', '2026-03-14', 'revenue', 80.60),
('00000000-0000-0000-0000-000000000001', '2026-03-15', 'revenue', 92.80),
('00000000-0000-0000-0000-000000000001', '2026-03-16', 'revenue', 105.40),
('00000000-0000-0000-0000-000000000001', '2026-03-17', 'revenue', 90.80),
('00000000-0000-0000-0000-000000000001', '2026-03-18', 'revenue', 78.60),
('00000000-0000-0000-0000-000000000001', '2026-03-19', 'revenue', 72.40),
('00000000-0000-0000-0000-000000000001', '2026-03-20', 'revenue', 86.20),
('00000000-0000-0000-0000-000000000001', '2026-03-21', 'revenue', 94.50),
('00000000-0000-0000-0000-000000000001', '2026-03-22', 'revenue', 102.80),
('00000000-0000-0000-0000-000000000001', '2026-03-23', 'revenue', 88.40),
('00000000-0000-0000-0000-000000000001', '2026-03-24', 'revenue', 80.20),
('00000000-0000-0000-0000-000000000001', '2026-03-25', 'revenue', 82.50),
('00000000-0000-0000-0000-000000000001', '2026-03-26', 'revenue', 90.80);

-- Revenue (monthly)
INSERT INTO revenue (channel_id, month, estimated_revenue, ad_revenue, membership_revenue, superchat_revenue, merchandise_revenue, premium_revenue, rpm, cpm, playback_based_cpm, ad_impressions, monetized_playbacks) VALUES
('00000000-0000-0000-0000-000000000001', '2025-10-01', 1850.00, 1480.00, 185.00, 92.50, 55.50, 37.00, 4.85, 6.80, 5.20, 280000, 356000),
('00000000-0000-0000-0000-000000000001', '2025-11-01', 2100.00, 1680.00, 210.00, 105.00, 63.00, 42.00, 5.10, 7.15, 5.50, 320000, 412000),
('00000000-0000-0000-0000-000000000001', '2025-12-01', 2850.00, 2280.00, 285.00, 142.50, 85.50, 57.00, 5.45, 7.80, 5.90, 420000, 520000),
('00000000-0000-0000-0000-000000000001', '2026-01-01', 2200.00, 1760.00, 220.00, 110.00, 66.00, 44.00, 5.05, 7.00, 5.35, 340000, 436000),
('00000000-0000-0000-0000-000000000001', '2026-02-01', 2450.00, 1960.00, 245.00, 122.50, 73.50, 49.00, 5.18, 7.25, 5.55, 365000, 468000),
('00000000-0000-0000-0000-000000000001', '2026-03-01', 2680.00, 2144.00, 268.00, 134.00, 80.40, 53.60, 5.30, 7.40, 5.65, 395000, 505000);

-- Realtime Stats
INSERT INTO realtime_stats (channel_id, current_viewers, views_last_48h, views_last_60min, top_video_id, hourly_data) VALUES
('00000000-0000-0000-0000-000000000001', 342, 38500, 1247,
'10000000-0000-0000-0000-000000000001',
'[{"hour":"12AM","views":420},{"hour":"1AM","views":380},{"hour":"2AM","views":310},{"hour":"3AM","views":280},{"hour":"4AM","views":250},{"hour":"5AM","views":290},{"hour":"6AM","views":380},{"hour":"7AM","views":520},{"hour":"8AM","views":680},{"hour":"9AM","views":850},{"hour":"10AM","views":920},{"hour":"11AM","views":1050},{"hour":"12PM","views":1180},{"hour":"1PM","views":1247},{"hour":"2PM","views":0},{"hour":"3PM","views":0},{"hour":"4PM","views":0},{"hour":"5PM","views":0},{"hour":"6PM","views":0},{"hour":"7PM","views":0},{"hour":"8PM","views":0},{"hour":"9PM","views":0},{"hour":"10PM","views":0},{"hour":"11PM","views":0}]');

-- Notifications
INSERT INTO notifications (channel_id, title, body, type, is_read) VALUES
('00000000-0000-0000-0000-000000000001', 'Congratulations! 150K subscribers!', 'Your channel has reached 150,000 subscribers. Keep up the great work!', 'milestone', true),
('00000000-0000-0000-0000-000000000001', 'New comment on "iPhone 16 Pro Max Review"', 'Alex Tech commented: "Best iPhone review I''ve seen!"', 'info', false),
('00000000-0000-0000-0000-000000000001', 'Community Guidelines update', 'We''ve updated our community guidelines. Please review the changes.', 'policy', false),
('00000000-0000-0000-0000-000000000001', 'Tip: Optimize your thumbnails', 'Videos with custom thumbnails get 30% more clicks. Try A/B testing!', 'tip', false),
('00000000-0000-0000-0000-000000000001', 'Your video is trending!', '"How to Build a PC in 2026" is trending in Technology. 🎉', 'milestone', false);
