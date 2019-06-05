'use strict';

const ProfileService={
  getProfile(db,id){
    return db
      .from('users')
      .select('*')
      .where({id});
  },
};

module.exports = ProfileService;