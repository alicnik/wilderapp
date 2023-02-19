const fs = require('fs');

const fullFacilitiesData = fs.readFileSync('./archive/Facilities_API_v1.json');
const fullFacilitiesContent = JSON.parse(fullFacilitiesData)
  .RECDATA.filter((facility) => {
    return (
      facility.FacilityID &&
      facility.FacilityLongitude &&
      facility.FacilityLatitude &&
      facility.FacilityName &&
      facility.FacilityDescription &&
      (facility.FacilityPhone || facility.FacilityEmail)
    );
  })
  .map((facility) => ({
    FacilityID: facility.FacilityID,
    ParentRecAreaID: facility.ParentRecAreaID,
    FacilityName: facility.FacilityName,
    FacilityDescription: facility.FacilityDescription,
    FacilityTypeDescription: facility.FacilityTypeDescription,
    FacilityPhone: facility.FacilityPhone,
    FacilityEmail: facility.FacilityEmail,
    FacilityLongitude: facility.FacilityLongitude,
    FacilityLatitude: facility.FacilityLatitude,
  }));
const filteredFacilitiesData = fullFacilitiesContent.filter(
  (facility) => facility.FacilityTypeDescription === 'Campground' && facility.ParentRecAreaID
);
const arrayOfFacilityIds = filteredFacilitiesData.map((facility) => facility.FacilityID);

const fullFacilitiesAddressesData = fs.readFileSync('./archive/FacilityAddresses_API_v1.json');
const fullFacilitiesAddressesContent = JSON.parse(fullFacilitiesAddressesData).RECDATA;
const filteredFacilitiesAddressesData = fullFacilitiesAddressesContent.filter((facility) =>
  arrayOfFacilityIds.includes(facility.FacilityID)
);

const filteredFacilitiesWithAddresses = filteredFacilitiesData
  .map((facility) => {
    const matchingFacility = filteredFacilitiesAddressesData.find(
      (facilityWithAddress) => facility.FacilityID === facilityWithAddress.FacilityID
    );
    if (!matchingFacility) return;
    return {
      ...facility,
      city: matchingFacility.City,
      address1: matchingFacility.FacilityStreetAddress1,
      address2: matchingFacility.FacilityStreetAddress2,
      state: matchingFacility.PostalCode,
    };
  })
  .filter((facility) => facility);

const fullMediaData = fs.readFileSync('./archive/Media_API_v1.json');
const fullMediaContent = JSON.parse(fullMediaData).RECDATA;
const filteredMediaContent = fullMediaContent.filter(
  (media) => media.MediaType === 'Image' && media.EntityType === 'Asset' && media.URL
);
const filteredFacilitiesWithAddressesAndMedia = filteredFacilitiesWithAddresses
  .map((facility) => {
    const matchingFacility = filteredMediaContent.find(
      (media) => media.EntityID === facility.FacilityID
    );
    if (!matchingFacility) return;
    return {
      ...facility,
      entityMedia: [{ title: matchingFacility.Title, url: matchingFacility.URL }],
    };
  })
  .filter((facility) => facility);

const campsiteData = fs.readFileSync('./archive/aggregatedCampsiteData.json');
const campsiteContent = JSON.parse(campsiteData).filter((campsite) =>
  arrayOfFacilityIds.includes(campsite.FacilityID)
);

const finalFacilities = filteredFacilitiesWithAddressesAndMedia.map((facility) => {
  const matchingCampsites = campsiteContent.filter(
    (campsite) => campsite.FacilityID === facility.FacilityID
  );
  if (!matchingCampsites) return;
  const matchingAttributes = matchingCampsites
    .flatMap((campsite) => campsite.attributes)
    .map((attributeSet) => ({
      name: attributeSet.AttributeName,
      value: attributeSet.AttributeValue,
    }))
    .reduce((finalAttributes, attr, ind, array) => {
      if (
        array.some((attribute) => attribute.name === 'Pets Allowed' && attribute.value === 'Yes')
      ) {
        const firstPetsIndex = finalAttributes.findIndex(
          (attribute) => attribute.name === 'petsAllowed'
        );
        firstPetsIndex === -1 &&
          finalAttributes.push({ name: 'petsAllowed', value: true, description: 'Pets allowed' });
      }
      const checkInTime = array.find((attribute) => attribute.name === 'Checkin Time');
      if (
        checkInTime &&
        finalAttributes.findIndex((attribute) => attribute.name === 'checkInTime') === -1
      ) {
        finalAttributes.push({
          name: 'checkInTime',
          value: checkInTime.value,
          description: 'Check-in time',
        });
      }
      const checkOutTime = array.find((attribute) => attribute.name === 'Checkout Time');
      if (
        checkOutTime &&
        finalAttributes.findIndex((attribute) => attribute.name === 'checkOutTime') === -1
      ) {
        finalAttributes.push({
          name: 'checkOutTime',
          value: checkOutTime.value,
          description: 'Check-out time',
        });
      }
      return finalAttributes;
    }, []);
  return {
    ...facility,
    accessible: matchingCampsites.some((campsite) => campsite.CampsiteAccessible),
    attributes: matchingAttributes,
  };
});

console.log(finalFacilities.length, ' campgrounds filtered.');

fs.writeFile('./finalFacilities.json', JSON.stringify(finalFacilities), (err) => console.log(err));
