import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axiosInstance from "./axiosInstance";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editTitle, setEditTitle] = useState("");

  const getBlogs = async() => {
    try {
      const response = await axiosInstance.get(`/get-blogs`);
      const blogs = response.data.blogs;
      setBlogs(blogs);
    } catch (error) {
      console.log("error:" + error)
    }
  }

  useEffect(() => {
    getBlogs();
  },[])

  const addBlog = async (blog) => {
    try {
      const response = await axiosInstance.post(`/add-blog`, blog);
      if(response.status == 200){
        setNewBlog("");
        setNewTitle("");
        getBlogs();
      }
      else{
        console.log("failed")
      }
    } catch (error) {
      console.error("Error adding blog:", error);
    }
  }

  const handleAddBlog = () => {
    if (newTitle.trim() && newBlog.trim()) {
      const blog = { id: uuidv4(), title: newTitle.trim(), content: newBlog.trim() };
      addBlog(blog);
    }
  };

  const handleEditBlog = (index) => {
    setEditingIndex(index);
    setEditContent(blogs[index].content);
    setEditTitle(blogs[index].title);
  };

  const handleSaveEdit = () => {
    console.log(blogs[editingIndex])
    const updatedBlog = {
      id: blogs[editingIndex].id,
      title: editTitle.trim(),
      content: editContent.trim(),
    };
    addBlog(updatedBlog);
    setEditContent("");
    setEditTitle("");
    setEditingIndex(null);
  };

  const handleDeleteBlog = async (index) => {
    const blogToDelete = blogs[index];
    try {
      const response = await axiosInstance.post(`delete-blog`, blogToDelete);
      if(response.status == 200){
        console.log("blog deleted");
        getBlogs();
      }else{
        console.log("blog deletion failed");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Blog Page</h1>
      {/* <h1>":"{import.meta.env.VITE_BACKEND_URL}</h1> */}

      {/* New Blog Section */}
      <div style={{ marginBottom: "20px" }}>
        <h2>Add a New Blog</h2>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Enter blog title..."
          style={{
            width: "calc(100% - 20px)",
            height: "40px",
            marginBottom: "10px",
            padding: "10px",
            boxSizing: "border-box",
          }}
        />
        <textarea
          value={newBlog}
          onChange={(e) => setNewBlog(e.target.value)}
          placeholder="Write your blog here..."
          style={{ width: "100%", height: "100px", marginBottom: "10px" }}
        ></textarea>
        <button onClick={handleAddBlog} style={{ padding: "10px 20px" }}>
          Add Blog
        </button>
      </div>

      {/* Blog List Section */}
      <div>
        <h2>Blogs</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          {blogs?.length === 0 ? (
            <p>No blogs added yet.</p>
          ) : (
            blogs?.map((blog, index) => (
              <div
                key={blog.id}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  width: "300px", // Set a consistent width for the cards
                  boxSizing: "border-box",
                  borderRadius: "8px", // Optional for rounded corners
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Optional shadow
                  textAlign: "center",
                }}
              >
                {editingIndex === index ? (
                  <div>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      style={{
                        width: "100%",
                        height: "40px",
                        marginBottom: "10px",
                        padding: "10px",
                        boxSizing: "border-box",
                      }}
                    />
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      style={{
                        width: "100%",
                        height: "80px",
                        marginBottom: "10px",
                        padding: "10px",
                        boxSizing: "border-box",
                      }}
                    ></textarea>
                    <button
                      onClick={handleSaveEdit}
                      style={{ marginRight: "10px", padding: "5px 15px" }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingIndex(null)}
                      style={{ padding: "5px 15px" }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <h3 style={{ marginBottom: "10px" }}>{blog.title}</h3>
                    <p style={{ marginBottom: "10px" }}>{blog.content}</p>
                    <button
                      onClick={() => handleEditBlog(index)}
                      style={{ marginRight: "10px", padding: "5px 15px" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(index)}
                      style={{ padding: "5px 15px" }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default BlogPage;
