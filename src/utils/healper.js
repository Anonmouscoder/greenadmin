// src/utils/helper.js
export const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };
  

  export const calculateTotalStats = (users, targetSponsor) =>{
      // Step 1: Build a map for quick lookups
      const userMap = new Map();
      users.forEach(user => 
          userMap.set(user.userId, { 
              ...user, 
              teamStack: user.personalStack, 
              teamInsurance: user.insurence || 0, 
              team: [] 
          })
      );
  
      // Step 2: Build the hierarchy (sponsor → direct users)
      users.forEach(user => {
          if (user.sponcerBy && userMap.has(user.sponcerBy) && user.userId !== user.sponcerBy) {
              userMap.get(user.sponcerBy).team.push(user.userId);
          }
      });
  
      // Step 3: Recursive function to compute total stack, insurance, and count users
      const computeStats = (userId) => {
          let user = userMap.get(userId);
          if (!user) return { totalStack: 0, totalInsurance: 0, totalUsers: 0 };
  
          let totalStack = user.personalStack;
          let totalInsurance = user.teamInsurance;
          let totalUsers = 1; // Include self in count
  
          for (let teamMember of user.team) {
              let { totalStack: teamStack, totalInsurance: teamInsurance, totalUsers: teamUserCount } = computeStats(teamMember);
              totalStack += teamStack;
              totalInsurance += teamInsurance;
              totalUsers += teamUserCount;
          }
  
          user.teamStack = totalStack;
          user.teamInsurance = totalInsurance;
  
          return { totalStack, totalInsurance, totalUsers };
      };
  
      // Step 4: Compute stats for the target sponsor
      if (!userMap.has(targetSponsor)) return null; // Return null if the sponsor is not found
  
      let { totalStack, totalInsurance, totalUsers } = computeStats(targetSponsor);
      return {
          userId: targetSponsor,
          totalPersonalStack: totalStack,
          totalUsersCount: totalUsers,
          totalInsurance: totalInsurance
      };
  }