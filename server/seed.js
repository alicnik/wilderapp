const fs = require('fs');
const mongoose = require('mongoose');
const User = require('./models/user');
const RecArea = require('./models/recArea');
const Campground = require('./models/campground');
const { dbURI } = require('./config/environment');
const defaultAvatarArray = [
  'https://i.ibb.co/DfJ5PWc/avatar-1.png',
  'https://i.ibb.co/HTq3qfD/avatar-2.png',
  'https://i.ibb.co/x38pzNJ/avatar-3.png',
  'https://i.ibb.co/Y8nck2y/avatar-4.png',
  'https://i.ibb.co/WF9Mxwb/avatar-5.png',
  'https://i.ibb.co/17LGhrB/avatar-6.png',
];

Array.prototype.randomElement = function () {
  return this[Math.floor(Math.random() * this.length)];
};

console.log('This dbURI: ', dbURI);

async function seed() {
  mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

  await mongoose.connection.dropDatabase();
  console.log('Database dropped');

  const facilities = JSON.parse(fs.readFileSync('./server/data/finalFacilities.json'));
  const campgrounds = await Campground.create(
    facilities.map((facility) => {
      return {
        ridbCampgroundId: facility.FacilityID,
        ridbRecAreaId: facility.ParentRecAreaID,
        name: facility.FacilityName,
        description: facility.FacilityDescription,
        phone: facility.FacilityPhone,
        email: facility.FacilityEmail,
        address1: facility.address1,
        address2: facility.address2,
        avgRating: 0,
        city: facility.city,
        state: facility.state,
        accessible: facility.accessible,
        longitude: facility.FacilityLongitude,
        latitude: facility.FacilityLatitude,
        attributes: facility.attributes,
        media: facility.entityMedia,
      };
    })
  );
  console.log(`${campgrounds.length} campgrounds created. Happy camping!`);

  const recAreaData = JSON.parse(fs.readFileSync('./server/data/finalRecAreaData.json'));
  const recAreas = await RecArea.create(
    recAreaData.map((recArea) => ({
      ridbRecAreaId: recArea.RecAreaID,
      name: recArea.RecAreaName,
      description: recArea.RecAreaDescription,
      phone: recArea.RecAreaPhone,
      email: recArea.RecAreaEmail,
      address1: recArea.address1,
      address2: recArea.address2,
      website: recArea.website,
      avgRating: 0,
      city: recArea.city,
      state: recArea.state,
      longitude: recArea.RecAreaLongitude,
      latitude: recArea.RecAreaLatitude,
      lastUpdated: recArea.lastUpdated,
      media: recArea.media,
      campgrounds: [
        ...campgrounds.filter((campground) => campground.ridbRecAreaId === recArea.RecAreaID),
      ],
    }))
  );
  console.log(`${recAreas.length} rec areas created. Time to get rickety-recked.`);

  await User.create([
    {
      username: 'alicnik',
      email: 'alicnik@hotmail.com',
      password: 'Alicnik123',
      passwordConfirmation: 'Alicnik123',
      firstName: 'Alex',
      lastName: 'Nicholas',
      isAdmin: true,
      avatar: defaultAvatarArray.randomElement(),
    },
    {
      username: 'ali_bhimani',
      email: 'ali_bhimani21@aol.com',
      password: 'Ali4President',
      passwordConfirmation: 'Ali4President',
      firstName: 'Ali',
      lastName: 'Bhimani',
      isAdmin: true,
      avatar: defaultAvatarArray.randomElement(),
    },
    {
      username: 'rich',
      email: 'richardbekoe@gmail.com',
      password: 'Rich1',
      passwordConfirmation: 'Rich1',
      firstName: 'Richard',
      lastName: 'Bekoe',
      isAdmin: true,
      avatar: defaultAvatarArray.randomElement(),
    },
    {
      username: 'doug',
      email: 'doug@doug.com',
      password: 'Douglas42',
      passwordConfirmation: 'Douglas42',
      firstName: 'Douglas',
      lastName: 'Adams',
      isAdmin: false,
      avatar: defaultAvatarArray.randomElement(),
    },
  ]);

  await mongoose.connection.close();
}

try {
  seed();
} catch (err) {
  console.error(err);
}
