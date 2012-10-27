def gentable(data):
    colsizes = [2, 4, 3, 3]
    print '<ul class="grid schedule container-fluid">'
    headers = data[:2]
    for row in headers:
        print '  <li class="row-fluid header">'
        for counter, col in enumerate(row):
            print (u'    <div class="span%d">%s</div>' % (colsizes[counter], col or '&nbsp;')).encode('utf-8')
        print '  </li>'
    for row in data[2:]:
        print '  <li class="row-fluid item">'
        for counter, item in enumerate(row):
            if isinstance(item, dict):
                item['sectionname'] = '-'.join(item.get('section', '').lower().replace('&', '').replace(',', '').split(' '))
                item['levelname'] = '-'.join(item.get('level', '').lower().replace('&', '').replace(',', '').split(' '))
                print '    <div class="span%d">' % colsizes[counter]
                print '    <div class="session-box {sectionname}" title="{section}">'.format(**item)
                if item.get('url'):
                    print '      <a href="{url}" target="_blank">{title}</a><br><div class="author">{speaker}</div><br><div class="{levelname}" title="{level}"></div>'.format(**item)
                else:
                    print '      {title}<br>&mdash;{speaker}'.format(**item)
                print '    </div></div>'
            else:
                print (u'    <div class="span%d">%s</div>' % (colsizes[counter], item)).encode('utf-8')
        print '  </li>'
    print '</ul>'

old_sched = [
 ['', 'Day 1', '', ''],
 ['Rooms', 'Audi', 'Hall', 'Room'],
 ['9:00-10:00', 'Registration', '', ''],
 ['10:00-11:00', 'TBD', '', ''],
 ['11:00-11:30', 'TBD', '', ''],
 ['11:30-12:00', 'Break', '', ''],
 ['12:00-12:30',
  {u'comments': 0,
   u'confirmed': True,
   u'email': None,
   u'id': 506,
   u'level': u'Beginner',
   u'name': u'506-the-real-incident-of-stealing-a-droid-app-data-in-daytime',
   u'phone': None,
   u'proposer': u'Akash Mahajan',
   u'section': u'General Topics',
   u'speaker': u'Akash Mahajan',
   u'submitted': u'2012-09-03T03:24:31',
   u'title': u'The Real Incident of Stealing a Droid App+Data in daytime',
   u'type': u'Lecture',
   u'url': u'http://funnel.hasgeek.com/droidcon2012/506-the-real-incident-of-stealing-a-droid-app-data-in-daytime',
   u'votes': 19},
  'TBD',
  'TBD'],
 ['12:30-1:00',
  {u'comments': 3,
   u'confirmed': True,
   u'email': None,
   u'id': 523,
   u'level': u'Beginner',
   u'name': u'523-augmented-reality-for-navigation-thru-the-galli',
   u'phone': None,
   u'proposer': u'Anenth Guru',
   u'section': u'App Demos',
   u'speaker': u'Anenth Guru',
   u'submitted': u'2012-09-12T10:56:47',
   u'title': u'Augmented Reality for Navigation - Thru the Galli',
   u'type': u'Demo',
   u'url': u'http://funnel.hasgeek.com/droidcon2012/523-augmented-reality-for-navigation-thru-the-galli',
   u'votes': 16},
  'TBD',
  'TBD'],
 ['1:00-1:30', 'Lunch', '', ''],
 ['1:30-2:00', 'Lunch', '', ''],
 ['2:00-2:30',
  {u'comments': 0,
   u'confirmed': True,
   u'email': None,
   u'id': 548,
   u'level': u'Intermediate',
   u'name': u'548-using-appcelerator-titanium-to-build-native-android-apps-without-the-native-pain',
   u'phone': None,
   u'proposer': u'Gaurav Kheterpal',
   u'section': u'Platforms, Tools & Libraries',
   u'speaker': u'Gaurav Kheterpal',
   u'submitted': u'2012-10-03T11:15:12',
   u'title': u'Using Appcelerator Titanium To Build Native Android Apps Without The Native Pain',
   u'type': u'Workshop',
   u'url': u'http://funnel.hasgeek.com/droidcon2012/548-using-appcelerator-titanium-to-build-native-android-apps-without-the-native-pain',
   u'votes': 11},
  'TBD',
  'TBD'],
 ['2:30-3:00',
  {u'comments': 0,
   u'confirmed': True,
   u'email': None,
   u'id': 499,
   u'level': u'Intermediate',
   u'name': u'499-constructive-design-for-android',
   u'phone': None,
   u'proposer': u'Isaac Wesley',
   u'section': u'Specialized Topics',
   u'speaker': u'Isaac Wesley',
   u'submitted': u'2012-08-31T14:58:10',
   u'title': u'Constructive Design for Android',
   u'type': u'Lecture',
   u'url': u'http://funnel.hasgeek.com/droidcon2012/499-constructive-design-for-android',
   u'votes': 26},
  'TBD',
  'TBD'],
 ['3:00-3:30',
  {u'comments': 4,
   u'confirmed': True,
   u'email': None,
   u'id': 497,
   u'level': u'Intermediate',
   u'name': u'497-microsoft-kinect-and-android',
   u'phone': None,
   u'proposer': u'Allen Thomas Varghese',
   u'section': u'App Demos',
   u'speaker': u'Allen Thomas Varghese',
   u'submitted': u'2012-08-31T14:42:56',
   u'title': u'Microsoft Kinect and Android',
   u'type': u'Demo',
   u'url': u'http://funnel.hasgeek.com/droidcon2012/497-microsoft-kinect-and-android',
   u'votes': 13},
  'TBD',
  'TBD'],
 ['3:30-4:00', 'Break', '', ''],
 ['4:00-4:30',
  {u'comments': 2,
   u'confirmed': True,
   u'email': None,
   u'id': 547,
   u'level': u'Beginner',
   u'name': u'547-move-as-i-speak',
   u'phone': None,
   u'proposer': u'Phanindra Rachamalla',
   u'section': u'Specialized Topics',
   u'speaker': u'Phanindra Rachamalla',
   u'submitted': u'2012-10-01T18:07:19',
   u'title': u'Move as i speak',
   u'type': u'Demo',
   u'url': u'http://funnel.hasgeek.com/droidcon2012/547-move-as-i-speak',
   u'votes': 30},
  'TBD',
  'TBD'],
 ['4:30-5:00',
  {u'comments': 3,
   u'confirmed': True,
   u'email': None,
   u'id': 444,
   u'level': u'Intermediate',
   u'name': u'444-nosql-location-based-queries-on-android-couchdb-mobile-replication-and-lucene',
   u'phone': None,
   u'proposer': u'Sameer Segal',
   u'section': u'Specialized Topics',
   u'speaker': u'Sameer Segal',
   u'submitted': u'2012-08-08T04:58:01',
   u'title': u'NoSQL & Location based queries on Android - CouchDB, Mobile Replication and Lucene',
   u'type': u'Tutorial',
   u'url': u'http://funnel.hasgeek.com/droidcon2012/444-nosql-location-based-queries-on-android-couchdb-mobile-replication-and-lucene',
   u'votes': 21},
  'TBD',
  'TBD']]

sched1 = [['', 'Day 1', '', ''], ['Rooms', 'Audi', 'Hall', 'Room'], ['9:00-10:00', 'Registration', 'Registration', 'Registration'], ['10:00-11:00', {u'confirmed': True, u'name': u'553-the-state-of-web-and-native-in-2012', u'title': u'The State of Web AND Native in 2012', u'url': u'http://funnel.hasgeek.com/droidcon2012/553-the-state-of-web-and-native-in-2012', u'section': u'Platforms, Tools & Libraries', u'level': u'Intermediate', u'votes': 5, u'submitted': u'2012-10-08T21:54:33', u'email': None, u'proposer': u'James Hugman', u'phone': None, u'speaker': u'James Hugman', u'comments': 0, u'type': u'Lecture', u'id': 553}, {u'confirmed': True, u'name': u'504-mobile-user-experience-design-what-developers-usually-miss', u'title': u'Mobile User Experience Design - What developers usually miss', u'url': u'http://funnel.hasgeek.com/droidcon2012/504-mobile-user-experience-design-what-developers-usually-miss', u'section': u'Specialized Topics', u'level': u'Intermediate', u'votes': 18, u'submitted': u'2012-09-02T15:34:31', u'email': None, u'proposer': u'Amrit Sanjeev', u'phone': None, u'speaker': u'Amrit Sanjeev', u'comments': 0, u'type': u'Lecture', u'id': 504}, {u'confirmed': True, u'name': u'545-android-accessory-development-with-beaglebone', u'title': u'Android Accessory development with Beaglebone', u'url': u'http://funnel.hasgeek.com/droidcon2012/545-android-accessory-development-with-beaglebone', u'section': u'Specialized Topics', u'level': u'Beginner', u'votes': 15, u'submitted': u'2012-09-26T13:27:21', u'email': None, u'proposer': u'Pankaj Bharadiya', u'phone': None, u'speaker': u'Pankaj Bharadiya', u'comments': 0, u'type': u'Lecture', u'id': 545}], ['11:00-11:30', 'TBD', {u'confirmed': True, u'name': u'549-android-ui-prototyping-101-what-why-how', u'title': u'Android UI prototyping 101: What? Why? How?', u'url': u'http://funnel.hasgeek.com/droidcon2012/549-android-ui-prototyping-101-what-why-how', u'section': u'General Topics', u'level': u'Beginner', u'votes': 14, u'submitted': u'2012-10-04T10:16:04', u'email': None, u'proposer': u'Soham Mondal', u'phone': None, u'speaker': u'Soham Mondal', u'comments': 2, u'type': u'Lecture', u'id': 549}, ''], ['11:30-12:00', 'Break', 'Break', 'Break'], ['12:00-12:30', {u'confirmed': True, u'name': u'506-the-real-incident-of-stealing-a-droid-app-data-in-daytime', u'title': u'The Real Incident of Stealing a Droid App+Data in daytime', u'url': u'http://funnel.hasgeek.com/droidcon2012/506-the-real-incident-of-stealing-a-droid-app-data-in-daytime', u'section': u'General Topics', u'level': u'Beginner', u'votes': 20, u'submitted': u'2012-09-03T03:24:31', u'email': None, u'proposer': u'Akash Mahajan', u'phone': None, u'speaker': u'Akash Mahajan', u'comments': 0, u'type': u'Lecture', u'id': 506}, {u'confirmed': True, u'name': u'561-mymobiledash-a-drupal-based-platform-for-mobile-apps', u'title': u'Mymobiledash - A Drupal based Platform for Mobile apps', u'url': u'http://funnel.hasgeek.com/droidcon2012/561-mymobiledash-a-drupal-based-platform-for-mobile-apps', u'section': u'Platforms, Tools & Libraries', u'level': u'Intermediate', u'votes': 23, u'submitted': u'2012-10-11T15:03:42', u'email': None, u'proposer': u'Prateek Jain', u'phone': None, u'speaker': u'Prateek Jain', u'comments': 5, u'type': u'Lecture', u'id': 561}, 'TBD'], ['12:30-1:00', {u'confirmed': True, u'name': u'523-augmented-reality-for-navigation-thru-the-galli', u'title': u'Augmented Reality for Navigation - Thru the Galli', u'url': u'http://funnel.hasgeek.com/droidcon2012/523-augmented-reality-for-navigation-thru-the-galli', u'section': u'App Demos', u'level': u'Beginner', u'votes': 21, u'submitted': u'2012-09-12T10:56:47', u'email': None, u'proposer': u'Anenth Guru', u'phone': None, u'speaker': u'Anenth Guru', u'comments': 3, u'type': u'Demo', u'id': 523}, {u'confirmed': True, u'name': u'517-location-based-shopping-application-delightcircle', u'title': u'Location Based Shopping Application - DelightCircle ', u'url': u'http://funnel.hasgeek.com/droidcon2012/517-location-based-shopping-application-delightcircle', u'section': u'App Demos', u'level': u'Intermediate', u'votes': 23, u'submitted': u'2012-09-10T19:37:23', u'email': None, u'proposer': u'Raviteja', u'phone': None, u'speaker': u'Raviteja', u'comments': 1, u'type': u'Demo', u'id': 517}, 'TBD'], ['1:00-1:30', 'Lunch', 'Lunch', 'Lunch'], ['1:30-2:00', 'Lunch', 'Lunch', 'Lunch'], ['2:00-2:30', {u'confirmed': True, u'name': u'548-using-appcelerator-titanium-to-build-native-android-apps-without-the-native-pain', u'title': u'Using Appcelerator Titanium To Build Native Android Apps Without The Native Pain', u'url': u'http://funnel.hasgeek.com/droidcon2012/548-using-appcelerator-titanium-to-build-native-android-apps-without-the-native-pain', u'section': u'Platforms, Tools & Libraries', u'level': u'Intermediate', u'votes': 11, u'submitted': u'2012-10-03T11:15:12', u'email': None, u'proposer': u'Gaurav Kheterpal', u'phone': None, u'speaker': u'Gaurav Kheterpal', u'comments': 0, u'type': u'Workshop', u'id': 548}, 'TBD', 'TBD'], ['2:30-3:00', {u'confirmed': True, u'name': u'499-constructive-design-for-android', u'title': u'Constructive Design for Android', u'url': u'http://funnel.hasgeek.com/droidcon2012/499-constructive-design-for-android', u'section': u'Specialized Topics', u'level': u'Intermediate', u'votes': 27, u'submitted': u'2012-08-31T14:58:10', u'email': None, u'proposer': u'Isaac Wesley', u'phone': None, u'speaker': u'Isaac Wesley', u'comments': 0, u'type': u'Lecture', u'id': 499}, 'TBD', 'TBD'], ['3:00-3:30', {u'confirmed': True, u'name': u'497-microsoft-kinect-and-android', u'title': u'Microsoft Kinect and Android', u'url': u'http://funnel.hasgeek.com/droidcon2012/497-microsoft-kinect-and-android', u'section': u'App Demos', u'level': u'Intermediate', u'votes': 21, u'submitted': u'2012-08-31T14:42:56', u'email': None, u'proposer': u'Allen Thomas Varghese', u'phone': None, u'speaker': u'Allen Thomas Varghese', u'comments': 4, u'type': u'Demo', u'id': 497}, 'TBD', 'TBD'], ['3:30-4:00', 'Break', 'Break', 'Break'], ['4:00-4:30', {u'confirmed': True, u'name': u'547-move-as-i-speak', u'title': u'Move as i speak', u'url': u'http://funnel.hasgeek.com/droidcon2012/547-move-as-i-speak', u'section': u'Specialized Topics', u'level': u'Beginner', u'votes': 32, u'submitted': u'2012-10-01T18:07:19', u'email': None, u'proposer': u'Phanindra Rachamalla', u'phone': None, u'speaker': u'Phanindra Rachamalla', u'comments': 2, u'type': u'Demo', u'id': 547}, 'TBD', 'TBD'], ['4:30-5:00', {u'confirmed': True, u'name': u'444-nosql-location-based-queries-on-android-couchdb-mobile-replication-and-lucene', u'title': u'NoSQL & Location based queries on Android - CouchDB, Mobile Replication and Lucene', u'url': u'http://funnel.hasgeek.com/droidcon2012/444-nosql-location-based-queries-on-android-couchdb-mobile-replication-and-lucene', u'section': u'Specialized Topics', u'level': u'Intermediate', u'votes': 23, u'submitted': u'2012-08-08T04:58:01', u'email': None, u'proposer': u'Sameer Segal', u'phone': None, u'speaker': u'Sameer Segal', u'comments': 3, u'type': u'Tutorial', u'id': 444}, 'TBD', 'TBD']]
sched2 = [['', 'Day 2', '', ''], ['Rooms', 'Audi', 'Hall', 'Room'], ['9:00-10:00', {u'confirmed': True, u'name': u'569-15-most-popular-topics-i-missed-at-droidcon-london-cause-i-was-too-busy-organising-the-event', u'title': u'15 most popular topics I missed at Droidcon London (cause I was too busy organising the event)', u'url': u'http://funnel.hasgeek.com/droidcon2012/569-15-most-popular-topics-i-missed-at-droidcon-london-cause-i-was-too-busy-organising-the-event', u'section': u'General Topics', u'level': u'Beginner', u'votes': 6, u'submitted': u'2012-10-15T19:59:38', u'email': None, u'proposer': u'Thibaut Rouffineau', u'phone': None, u'speaker': u'Thibaut Rouffineau', u'comments': 2, u'type': u'Lecture', u'id': 569}, '', {u'confirmed': True, u'name': u'497-microsoft-kinect-and-android', u'title': u'Microsoft Kinect and Android', u'url': u'http://funnel.hasgeek.com/droidcon2012/497-microsoft-kinect-and-android', u'section': u'App Demos', u'level': u'Intermediate', u'votes': 21, u'submitted': u'2012-08-31T14:42:56', u'email': None, u'proposer': u'Allen Thomas Varghese', u'phone': None, u'speaker': u'Allen Thomas Varghese', u'comments': 4, u'type': u'Demo', u'id': 497}], ['10:00-11:00', {u'confirmed': True, u'name': u'556-writing-toolkits-frameworks-and-plugins-a-developer-masterclass-in-writing-re-usable-code', u'title': u'Writing Toolkits, Frameworks and Plugins. A Developer Masterclass in Writing Re-usable Code.', u'url': u'http://funnel.hasgeek.com/droidcon2012/556-writing-toolkits-frameworks-and-plugins-a-developer-masterclass-in-writing-re-usable-code', u'section': u'General Topics', u'level': u'Advanced', u'votes': 1, u'submitted': u'2012-10-08T23:33:17', u'email': None, u'proposer': u'James Hugman', u'phone': None, u'speaker': u'James Hugman', u'comments': 0, u'type': u'Lecture', u'id': 556}, '', ''], ['11:00-11:30', 'TBD', '', ''], ['11:30-12:00', 'Break', 'Break', 'Break'], ['12:00-12:30', {u'confirmed': True, u'name': u'574-using-mat-memory-analyzer-tool-to-understand-memory-issues-in-your-app', u'title': u'Using MAT (Memory Analyzer Tool) to understand memory issues in your app', u'url': u'http://funnel.hasgeek.com/droidcon2012/574-using-mat-memory-analyzer-tool-to-understand-memory-issues-in-your-app', u'section': u'Platforms, Tools & Libraries', u'level': u'Beginner', u'votes': 7, u'submitted': u'2012-10-16T18:19:15', u'email': None, u'proposer': u'Kakkirala Lakshman', u'phone': None, u'speaker': u'Kakkirala Lakshman', u'comments': 0, u'type': u'Tutorial', u'id': 574}, 'TBD', 'TBD'], ['12:30-1:00', {u'confirmed': True, u'name': u'527-optimizing-for-battery-measuring-and-managing-power-consumption-of-android-apps', u'title': u'Optimizing for Battery - Measuring and managing power consumption of Android apps', u'url': u'http://funnel.hasgeek.com/droidcon2012/527-optimizing-for-battery-measuring-and-managing-power-consumption-of-android-apps', u'section': u'Platforms, Tools & Libraries', u'level': u'Intermediate', u'votes': 11, u'submitted': u'2012-09-14T11:38:28', u'email': None, u'proposer': u'Kumar Rangarajan', u'phone': None, u'speaker': u'Kumar Rangarajan', u'comments': 0, u'type': u'Demo', u'id': 527}, 'TBD', 'TBD'], ['1:00-1:30', 'Lunch', 'Lunch', 'Lunch'], ['1:30-2:00', 'Lunch', 'Lunch', 'Lunch'], ['2:00-2:30', 'TBD', 'TBD', 'TBD'], ['2:30-3:00', 'TBD', 'TBD', 'TBD'], ['3:00-3:30', 'TBD', 'TBD', 'TBD'], ['3:30-4:00', 'Break', 'Break', 'Break'], ['4:00-4:30', {u'confirmed': True, u'name': u'576-advanced-controls-for-android-games', u'title': u'Advanced Controls for Android Games', u'url': u'http://funnel.hasgeek.com/droidcon2012/576-advanced-controls-for-android-games', u'section': u'Specialized Topics', u'level': u'Intermediate', u'votes': 38, u'submitted': u'2012-10-17T09:46:00', u'email': None, u'proposer': u'umashankar chidige', u'phone': None, u'speaker': u'umashankar chidige', u'comments': 6, u'type': u'Lecture', u'id': 576}, 'TBD', 'TBD'], ['4:30-5:00', 'TBD', 'TBD', 'TBD']]

gentable(sched1)
gentable(sched2)
