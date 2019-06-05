'use strict';

const ProfileService={
  getProfile(db,id){
    return db
      .from('users')
      .select('username','user_description','image')
      .where({id})
      .first();
  },

};

module.exports = ProfileService;