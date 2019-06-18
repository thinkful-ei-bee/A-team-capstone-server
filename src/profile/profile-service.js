'use strict';
const xss = require('xss');

const ProfileService={
  getProfile(db,id){
    return db
      .from('users')
      .select('id','username','user_description','image')
      .where({id})
      .first();
  },
  serializeProfile(profile) {
    return { 
      id: profile.id,
      username: xss(profile.username),
      user_description: xss(profile.user_description),
      image: xss(profile.image)
    };
  }
};

module.exports = ProfileService;