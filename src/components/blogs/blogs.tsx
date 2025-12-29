"use client";
import { useMemo, useState, useEffect, useCallback } from "react";
import CustomTableSearchBar from "../custom/searchBar";
import NotFound from "@/app/lead-crm/not-found";
import BlogTable from "./blogTable";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchBlogs } from "@/lib/features/blogs/blogApi";
import { RootState } from "@/lib/store/store";
import { Blog } from "@/lib/features/blogs/blogSlice";

export type HeaderBlog = {
  key: keyof Blog | "actions";
  label: string;
  minW: string;
};

export default function Blogs() {
  const dispatch = useAppDispatch();
  const { blogs, loading, page, limit, total, totalPages } = useAppSelector(
    (state: RootState) => state.blogs
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const headers: HeaderBlog[] = [
    { key: "title", label: "TITLE", minW: "min-w-[250px]" },
    { key: "author", label: "AUTHOR", minW: "min-w-[150px]" },
    { key: "tags", label: "TAGS", minW: "min-w-[200px]" },
    { key: "createdAt", label: "DATE", minW: "min-w-[140px]" },
    { key: "actions", label: "ACTIONS", minW: "min-w-[100px]" },
  ];

  const searchKeys = useMemo(
    () =>
      headers
        .filter((column) => column.key !== "actions")
        .map((c) => c.key) as (keyof Blog)[],
    [headers]
  );

  const fetchBlogsData = useCallback(
    (pageNum: number, search?: string) => {
      const params: { page: number; limit: number; search?: string } = {
        page: pageNum,
        limit: 15,
      };
      if (search && search.trim() !== "") {
        params.search = search.trim();
      }
      dispatch(fetchBlogs(params));
    },
    [dispatch]
  );

  useEffect(() => {
    fetchBlogsData(1);
  }, [fetchBlogsData]);

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    const searchValue = searchQuery.trim() !== "" ? searchQuery : undefined;
    fetchBlogsData(pageNumber, searchValue);
  };

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      setCurrentPage(1);
      const searchValue = query.trim() !== "" ? query : undefined;
      fetchBlogsData(1, searchValue);
    },
    [fetchBlogsData]
  );

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - maxVisiblePages + 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  const indexOfFirstItem = (currentPage - 1) * limit;
  const indexOfLastItem = Math.min(currentPage * limit, total);

  return (
    <div>
      <CustomTableSearchBar<Blog>
        data={blogs}
        onSearch={handleSearch}
        searchKeys={searchKeys}
        placeholder="Search by developer name, email, or phone number"
      />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      ) : blogs.length === 0 ? (
        <NotFound />
      ) : (
        <BlogTable
          blogs={blogs}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          getPageNumbers={getPageNumbers}
          dataLength={total}
          indexOfFirstItem={indexOfFirstItem}
          indexOfLastItem={indexOfLastItem}
          onRefreshBlogs={() => {
            const searchValue = searchQuery.trim() !== "" ? searchQuery : undefined;
            fetchBlogsData(currentPage, searchValue);
          }}
        />
      )}
    </div>
  );
}

