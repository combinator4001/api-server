//username
export const usernameMinLentgh = 6;
export const usernameMaxLentgh = 20;

//password
export const passwordMinLength = 6;
export const passwordMaxLength = 100;

//firstName, lastName, name
export const nameMinLength = 1;
export const nameMaxLength = 50;

// bcrypt
export const saltOrRounds = 10;

//jwt expirations

export const frontServerUrl : string = 'http://localhost:3000';
export const imageStorageUrl : string = 'https://combinator-profile-images.s3.ir-thr-at1.arvanstorage.com';
export const blogStorageUrl : string = 'https://combinator-blogs.s3.ir-thr-at1.arvanstorage.com';
export const apiServerUrl : string = 'http://localhost:5000';

//tags
export const tagNameMinLength = 2;
export const tagNameMaxLength = 20;

//blog
export const titleMinLength = 3;
export const titleMaxLength = 50;

export const blogContentMinLength = 5;
export const blogContentMaxLength = 5000;

export const estimatedMinutesMin = 1;
export const estimatedMinutesMax = 24 * 60;

export const tagIdsArrayMaxSize = 5;