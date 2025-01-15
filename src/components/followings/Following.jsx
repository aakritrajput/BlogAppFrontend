import {useCallback, useEffect, useState} from 'react'
import BloggerCard from '../bloggerCard/BloggerCard';
import axios from 'axios';
import { useParams } from 'react-router-dom';
function Following() {
    const {bloggerId} = useParams();
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore , setHasMore] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [page , setPage] = useState(1);
    const limit = 10;

    const getFollowings = useCallback( async() => {
        if (loading || !hasMore) return ;
        setLoading(true);
        try {
            const response = await axios.get(`https://blogappbackend-uy9g.onrender.com/api/v1/followings/userFollowings/${bloggerId}?page=${page}&limit=${limit}`, {withCredentials: true})
            setFollowing((prev)=> [...prev , ...response.data.data.docs])
            setHasMore(response.data.data.hasNextPage);
        } catch (error) {
            error.status === 401 ? setErrorMessage("You are not authorized to perform this action or perform this task !! please login .. ") : setErrorMessage(error.response.data)
        }finally{
            setLoading(false);
        }
    },[page])

    useEffect(()=>{
        getFollowings();
    },[getFollowings])

    const scrollHandler = (e) => {
        const nearBottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 50; // Start fetching when 50px from the bottom
        if (nearBottom && hasMore && !loading) {
          setPage((prevPage) => prevPage + 1); // Increment page to load more blogs
        }
    }

    
  return (
    <>
        <h1 className="text-[#207F87] text-3xl w-full flex justify-center bg-[#DDDBDB] font-semibold py-3">BlogApp</h1>
        <div className='h-[100vh] bg-[#DDDBDB]'>
            <h1 className='w-full flex justify-center text-2xl font-semibold mb-3 text-[#1a4759]'>following</h1>
            <div className="w-full  items-center flex flex-col gap-y-4 " onScroll={scrollHandler}>
             {following &&
               following.length > 0 &&
               following.map((doc) => (
                 <div key={doc.blogger?._id} className="flex justify-center">
                   <BloggerCard
                     username={doc.blogger?.username}
                     fullname={doc.blogger?.fullname}
                     bio={doc.blogger?.bio}
                     userId={doc.blogger?._id}
                     profilePic={doc.blogger?.profilePic}
                   />
                 </div>
               ))}
            </div>
            {loading && 
            <div className="w-full h-[30px]  flex justify-center items-center my-7">
                <div className="animate-spin rounded-full h-[30px] w-[30px] border-t-[5px] border-[#207F87]"></div>
            </div>}
            {errorMessage && <div className="w-full text-centre my-7 flex justify-center" >{errorMessage}</div>}
            {!hasMore && <div className="w-full text-center my-7">No more following to load</div>}
          
        </div>
    </>
  )
}

export default Following
