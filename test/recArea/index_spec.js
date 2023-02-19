/* global describe, beforeEach, afterEach, it, api */

const RecArea = require('../../server/models/recArea')
const Campground = require('../../server/models/campground')
const { expect } = require('chai')

describe('GET /api/recAreas', () => {

  beforeEach(done => {
    Campground.create([{
      ridbCampgroundId: '252621',
      ridbRecAreaId: '1033',
      name: 'Big Rock Group',
      description: '<h2>Overview</h2>\nBig Rock Group Campground is located in beautiful Huntington Canyon, along the Huntington Canyon National Scenic Byway on Utah Highway 31. It is situated at an elevation of 7,600 feet. Many recreational activities are available, including hiking, biking and fishing.<h2>Recreation</h2>\nPopular activities enjoyed by visitors to the area include fishing, hunting, hiking, mountain biking, horseback riding, rock climbing and scenic driving. Huntington Creek is a Blue Ribbon fishery, providing high quality brown, cutthroat and rainbow trout.<br />\n<br />\nThe 4-mile Left Fork of the Huntington National Recreation Trail is nearby and is open to hikers and horseback riders. The 10-mile Fish Creek Trail, for hiking, biking and horseback riding is also close by.<h2>Facilities</h2>\nThe campground provides one large-group site that can accommodate up to 50 people. A large, gravel parking area provides ample room for RVs of any size. Accessible vault toilets are provided, but drinking water is not available at the campground. Visitors are asked to carry out all garbage.<h2>Natural Features</h2>\nHuntington Creek flows alongside the campground. Pine and fir trees line the edges surrounding the campground, but offer little shade within the site. The surrounding area has numerous lakes and streams, vibrant summer wildflowers, colorful fall foliage and abundant wildlife.\n<h2>Nearby Attractions</h2>\nThe Huntington Canyon National Scenic Byway is part of the 86-mile Energy Loop. It offers stunning mountain and lake views as it tops 10,000 feet in elevation.<br />\n<br />\nThe historic Stuart Guard Station Visitor Center is nearby, offering a glimpse of the 1930s life of a ranger and his family who once lived there. Exhibits of Civilian Conservation Corps projects and original equipment are on display there. Area information is available as well.',
      phone: '(445) 102-4410',
      email: 'bigrock@camping.gov.us',
      address1: '10 HighlanderAvenue',
      address2: '',
      city: 'Denver',
      state: 'UT',
      accessible: true,
      longitude: -111.1555556,
      latitude: 39.5125,
      attributes: [{ petsAllowed: true }, { checkInTime: '02:00PM' }, { checkOutTime: '12:00PM' }],
      media: [{ title: 'Big Rock Group campground', url: 'https://cdn.recreation.gov/public/2019/12/06/13/55/258693_2e35e952-1fcc-4a04-b2db-6d5c4ccac735.jpeg' }]
    },
    {
      ridbCampgroundId: '250039',
      ridbRecAreaId: '1033',
      name: 'Miller Flat Reservoir Campground',
      description: '<h2>Overview</h2>\n<p>Miller Flat Reservoir Campground is located in a high mountain valley near Miller Flat Reservoir, at an elevation of 8,500 feet. Visitors enjoy fishing, canoeing, horseback riding and exploring the surrounding off-road vehicle trails. The campground rest in a stand of aspen and spruce trees and sites the sites range from having partial to full shade throughout the day. </p>\n\n<p>Visitors are allowed to configure their vehicles and trailers as they choose within the site. Group cooking facilities are provided including picnic tables, a fire ring, dutch oven fire pan and utility tables. A vault toilet facility is located about 50 feet from the site. There is no electricity, water, sewer or garbage services. If the group site is not reserved, it is available to visitors on a first-come, first-served basis for $5.00 per vehicle per night. To maintain priority for reservations, first-come, first-served customers may only pay for two nights at a time. The three double family sites in the campground are only available on a first-come, first-served basis for $5.00 per vehicle per night. </p>\n\n<p>Nearby attractions include Miller Flat Reservoir, Potters Pond, Skyline Drive, and the expansive Arapeen OHV Trail System which has more than 350 miles of designated, maintained OHV trails.</p>\n<p>Hiking trails near this campground include the Left Fork of Hunting National Recreation Trail which is 1.5 miles north of the campground and various hiking opportunities 2 miles south in Scad Valley. </p>\n\n<h2>Recreation</h2>\nLake Canyon Recreation Area is located just north of the campground as is the northern trailhead of the Left Fork of Huntington National Recreation Trail.  Cleveland and Huntington Reservoirs are located just minutes north of the campground along U31.  Each offers trout fishing opportunities, with a boat ramp available at Huntington Reservoir.<h2>Facilities</h2>\nVisitors are allowed to configure their vehicles and trailers as they choose within the site.  Group cooking facilities are provided including picnic tables, a fire ring, dutch oven fire pan and utility tables.  A vault toilet facility is located about 50 feet from the site.  \n\nThere is no electricity, water, sewer or garbage services. <br/><br/>\n\nIf the group site is not reserved, it is available to visitors on a first-come, first-served basis for $5.00 per vehicle per night.  To maintain priority for reservations, first-come, first-served customers may only pay for two nights at a time.  The three double family sites in the campground are only available on a first-come, first-served basis for $5.00 per vehicle per night.  They are not reservable.<h2>Natural Features</h2>\nThe group site is set in an open meadow with aspen and fir trees bordering the northern perimeter.\n<h2>Nearby Attractions</h2>\nPotters Ponds, a popular trout fishery is located approximately seven miles south of the campground.  The 370-mile Arapeen Off-highway Vehicle Trail System can be accessed directly from the campground by riding north or south along the Miller Flat Road.   Maps are available from hosts working in the area.',
      phone: '435-384-2372',
      email: 'r4_m-l_ferron@fs.fed.us',
      address1: '14 Miller Road',
      address2: 'The Flats',
      city: 'Salt Lake City',
      state: 'UT',
      accessible: false,
      longitude: -111.2510361,
      latitude: 39.5222167,
      attributes: [{ petsAllowed: false }, { checkInTime: '01:00PM' }, { checkOutTime: '01:00PM' }],
      media: [{ title: 'Miller Flat Reservoir Campground', url: 'https://cdn.recreation.gov/public/2019/12/06/13/55/258693_2e35e952-1fcc-4a04-b2db-6d5c4ccac735.jpeg' }]
    }
    ])
      .then(returnedCampgrounds => {
        return RecArea.create([{
          ridbRecAreaId: '1033',
          name: 'Manti-La Sal National Forest',
          description: 'Do you love the outdoors?  You can find something fun to do on The Manti-La Sal National Forest.',
          phone: '605-745-5476',
          email: 'thecamp@mlsforest.com',
          address1: 'Manti-La Sal National Forest',
          address2: 'Some forest somewhere over the rainbow',
          website: 'www.beavercreek.com',
          city: 'Salt Lake City',
          state: 'Utah',
          longitude: -111.272176,
          latitude: 39.300027,
          lastUpdated: '2020-03-20',
          media: {
            _id: '5efe1fb02f0d4e28b5d047e7',
            title: 'Rocky Mountains on the Grand Avenue Tour.',
            url: 'https://cdn.recreation.gov/public/2018/08/14/14/46/59f83109-847e-44d2-945d-04608ff895eb_1600.jpg'
          },
          campgrounds: [returnedCampgrounds[0], returnedCampgrounds[1]]
        }])
      })
      .then(() => done())
  })

  afterEach(done => {
    RecArea
      .deleteMany()
      .then(() => {
        Campground.deleteMany()
          .then(() => done())
      })
  })

  it('should return a 200 response', done => {
    api.get('/api/recareas')
      .end((err, res) => {
        expect(res.status).to.eq(200)
        done()
      })
  })

  it('should be an array with 1 items', done => {
    api.get('/api/recareas')
      .end((err, res) => {
        expect(res.body).to.be.an('array')
        expect(res.body.length).to.be.eq(1)
        done()
      })
  })

})