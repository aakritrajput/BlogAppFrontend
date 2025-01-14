import {useCallback, useEffect, useState} from 'react'
import BloggerCard from '../bloggerCard/BloggerCard';
import axios from 'axios';
import { useParams } from 'react-router-dom';
function Follower() {
    const {bloggerId} = useParams();
    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore , setHasMore] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [page , setPage] = useState(1);
    const limit = 10;

    const getFollowers = useCallback( async() => {
        if (loading || !hasMore) return ;
        setLoading(true);
        try {
            const response = await axios.get(`/api/v1/followings/userFollowers/${bloggerId}?page=${page}&limit=${limit}`, {withCredentials: true})
            setFollowers((prev)=> [...prev , ...response.data.data.docs])
            console.log("data of followers :" , response.data.data.docs)
            setHasMore(response.data.data.hasNextPage);
        } catch (error) {
            error.status === 401 ? setErrorMessage("You are not authorized to perform this action or perform this task !! please login .. ") : setErrorMessage(error.response.data)
            console.log(`from followers error.response.data : ${error}`)
        }finally{
            setLoading(false);
        }
    },[page])

    useEffect(()=>{
        getFollowers();
    },[getFollowers])

    const scrollHandler = (e) => {
      console.log("scroll trigered !!")
        const nearBottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 50; // Start fetching when 50px from the bottom
        if (nearBottom && hasMore && !loading) {
          setPage((prevPage) => prevPage + 1); // Increment page to load more blogs
          console.log("handlescroll triggered !!")
        }
    }

    
  return (
    <>
        <h1 className="text-[#207F87] text-3xl w-full flex justify-center bg-[#DDDBDB] font-semibold py-3">BlogApp</h1>
        <div className=' bg-[#DDDBDB] h-[100vh]'>
            <h1 className='w-full flex justify-center text-2xl font-semibold bg-[#DDDBDB] mb-4 text-[#1a4759]'>followers</h1>
            <div className="w-full  items-center flex flex-col gap-y-4 bg-[#DDDBDB] " onScroll={scrollHandler}>
             {followers &&
               followers.length > 0 &&
               followers.map((doc) => (
                 <div key={doc.follower?._id} className="flex justify-center">
                   <BloggerCard
                     username={doc.follower?.username}
                     fullname={doc.follower?.fullname}
                     bio={doc.follower?.bio}
                     userId={doc.follower?._id}
                     profilePic={doc.follower?.profilePic}
                   />
                 </div>
               ))}
            </div>
            {loading && 
            <div className="w-full h-[30px]  flex justify-center bg-[#DDDBDB] items-center my-7">
                <div className="animate-spin rounded-full h-[30px] bg-[#DDDBDB] w-[30px] border-t-[5px] border-[#207F87]"></div>
            </div>}
            {errorMessage && <div className="w-full text-centre my-7 flex bg-[#DDDBDB] justify-center" >{errorMessage}</div>}
            {!hasMore && <div className="w-full text-center bg-[#DDDBDB] my-7">No more followers to load</div>}
          
        </div>
    </>
  )
}

export default Follower
