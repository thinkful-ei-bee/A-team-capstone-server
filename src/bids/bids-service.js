'use strict';
const xss = require('xss');

const BidsService = {
  addBid(db, newBid) {
    return db
      .insert(newBid)
      .into('bids')
      .returning('*')
      .then(([bid]) => bid);
  },
  getBidsByUser(db, user_id) {
    return db
      .select('bids.id', 'project_id', 'bid', 'project_name', 'project_description', 'languages', 'requirements', 'deadline', 'openPositions', 'status')
      .from('bids')
      .join('projects', function() {
        this.on('projects.id', '=', 'bids.project_id');
      })
      .where ('bids.user_id', user_id );
  },
  getBidsByProject(db, project_id) {
    return db
      .select('*')
      .from('bids')
      .where( {project_id});
  },
  getBidsForUserProjects(db, user_id) {
    return db
      .select('bids.*', 'username', 'user_description', 'image') 
      .from('bids')
      .join('projects', function() {
        this.on('bids.project_id', '=', 'projects.id');
      })
      .join('users', function() {
        this.on('bids.user_id', '=', 'users.id');
      })
      .where('owner_id', user_id);
  },
  removeBid(db, id) {
    return db('bids')
      .where( { id } )
      .del();
  },
  getBidById(db, id) {
    return db('bids')
      .where( { id } )
      .first();
  },
  acceptBid(db, id) {
    return db('bids')
      .where( { id } )
      .update({status: 'accepted'});
  },
  declineBid(db, id) {
    return db('bids')
      .where( { id } )
      .update({status: 'declined'});
  },
  updateStatus(db, id, newStatus) {
    return db('bids')
      .where( { id } )
      .update({ status: newStatus });
  },
  serializeBids(bids) {
    return bids.map(bid => this.serializeBid(bid));
  },
  serializeBid(bid) {
    return {
      id: bid.id,
      user_id: bid.user_id,
      project_id: bid.project_id,
      bid: xss(bid.bid),
      status: xss(bid.status)
    };
  },
  serBidsByUser(bids) {
    return bids.map(bid => this.serBidByUser(bid));
  },
  serBidByUser(bid) {
    return {
      id: bid.id,
      project_id: bid.project_id,
      bid: xss(bid.bid),
      project_name: xss(bid.project_name),
      project_description: xss(bid.project_description),
      languages: xss(bid.languages),
      requirements: xss(bid.requirements),
      deadline: bid.deadline,
      openPositions: bid.openPositions,
      status: xss(bid.status)
    };
  },
  serBidsForUserProjects(bids) {
    return bids.map(bid => this.serBidForUserProject(bid));
  },
  serBidForUserProject(bid) {
    return {
      id: bid.id,
      user_id: bid.user_id,
      project_id: bid.project_id,
      bid: xss(bid.bid),
      status: xss(bid.status),
      username: xss(bid.username),
      user_description: xss(bid.user_description),
      image: xss(bid.image)
    };
  }
};

module.exports = BidsService;