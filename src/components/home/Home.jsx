import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import BlogCard from "../blogCard/BlogCard.jsx";

function Home() {
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Function to get blogs from cache (if available)
  const getCachedBlogs = () => {
    const cachedData = localStorage.getItem("cachedBlogs");
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return [];
  };

  // Function to save blogs to cache
  const saveBlogsToCache = (blogs) => {
    localStorage.setItem("cachedBlogs", JSON.stringify(blogs));
  };

  // Fetch blogs from API
  const getBlogs = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const response = await axios.get(
        `https://blogappbackend-uy9g.onrender.com/api/v1/blog/allBlogs?page=${page}&limit=${limit}`
      );

      const newBlogs = response.data.data.docs;
      const updatedBlogs = [...blogs, ...newBlogs];

      setBlogs(updatedBlogs);
      saveBlogsToCache(updatedBlogs); // Cache the updated blogs
      setHasMore(page < response.data.data.totalPages);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "An error occurred while fetching blogs"
      );
    } finally {
      setLoading(false);
    }
  }, [page]);

  // Handle scroll to fetch more blogs
  const handleScroll = useCallback((e) => {
    const nearBottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 50; // Start fetching when 50px from the bottom
    if (nearBottom && hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
      console.log("handlescroll triggered !!");
    }
  }, [loading, hasMore]);

  useEffect(() => {
    const cachedBlogs = getCachedBlogs();
    if (cachedBlogs.length > 0) {
      setBlogs(cachedBlogs); // Load cached data first
    }
    getBlogs(); // Fetch new data from API
  }, [getBlogs]);

  return (
    <div onScroll={handleScroll} className="bg-[#DDDBDB] pt-8 w-[100vw] pb-[70px] h-[90vh] overflow-y-auto">
      <div className="lg:px-[40px] px-4 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 gap-y-11">
        {blogs.map((blog) => (
          <div key={blog._id} className="flex justify-center">
            <BlogCard
              coverImage={blog.coverImage}
              title={blog.title}
              content={blog.content}
              authorImage={blog.author?.profilePic}
              authorName={blog.author?.username}
              blogId={blog._id}
              authorId={blog.author?._id}
            />
          </div>
        ))}
      </div>

      {loading && (
        <div className="w-full h-[30px] flex justify-center items-center my-7">
          <div className="animate-spin rounded-full h-[30px] w-[30px] border-t-[5px] border-[#207F87]"></div>
        </div>
      )}
      {errorMessage && <div className="text-red-600 w-full flex justify-center text-center my-7">{errorMessage}</div>}
      {!hasMore && <div className="w-full flex justify-center text-center my-7">No more blogs to load</div>}
    </div>
  );
}

export default Home;
