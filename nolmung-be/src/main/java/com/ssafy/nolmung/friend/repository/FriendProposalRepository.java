package com.ssafy.nolmung.friend.repository;

import com.ssafy.nolmung.friend.domain.Friend;
import com.ssafy.nolmung.friend.domain.FriendProposal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import java.util.List;

@Repository
@RequiredArgsConstructor

public class FriendProposalRepository {

    private final EntityManager em;

    public void regist (FriendProposal friendProposal) {

        em.persist(friendProposal);

    }

    public FriendProposal findById (int id) {

       return em.find(FriendProposal.class,id);

    }

    public void delete (FriendProposal friendProposal) {

        em.remove(friendProposal);

    }


    public List<FriendProposal> findFriendProposalListByToUserId(int toUserId) {

        List<FriendProposal> friendProposalList =  em.createQuery("SELECT fp FROM FriendProposal fp WHERE fp.toUserId = :to_user_id",FriendProposal.class)
                .setParameter("to_user_id",toUserId).getResultList();

        return friendProposalList;
    }

    public FriendProposal findFriendProposalByDuoId(int fromUserId,int toUserId) {

        FriendProposal friendProposal =  em.createQuery("SELECT fp FROM FriendProposal fp WHERE fp.fromUserId = :from_user_id AND fp.toUserId = :to_user_id",FriendProposal.class)
                .setParameter("from_user_id",fromUserId).setParameter("to_user_id",toUserId).getSingleResult();

        return friendProposal;
    }
}
