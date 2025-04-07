import React, { useEffect, useRef, useState } from "react";
import StoryCard from "./StoryCard";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePostStore } from "@/store/usePostStore";
import { Button } from "@/components/ui/button";
import { Circle, Star, Sparkles, Globe } from "lucide-react";

const StorySection = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const containerRef = useRef();
  const {story,fetchStoryPost} = usePostStore()

  useEffect(() => {
    fetchStoryPost()
  },[fetchStoryPost])


  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const updateMaxScroll = () => {
        setMaxScroll(container.scrollWidth - container.offsetWidth);
        setScrollPosition(container.scrollLeft);
      };
      updateMaxScroll();
      window.addEventListener("resize", updateMaxScroll);
      return () => window.removeEventListener("resize", updateMaxScroll);
    }
  }, [story]);

  const scroll = (direction) => {
    const container = containerRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      setScrollPosition(container.scrollLeft);
    }
  };

  return (<>
 <div className="relative w-full h-screen flex items-center justify-center bg-gradient-to-b from-purple-600 via-blue-500 to-teal-500 overflow-hidden"
 style={{height:'16rem'}}>
      {/* Background Glowing Circle */}
      <div className="absolute w-60 h-60 bg-blue-300 rounded-full blur-3xl opacity-40"></div>

      {/* Geometric Shapes */}
      <div className="absolute w-96 h-96 border-2 border-white rounded-full flex items-center justify-center">
        <div className="w-72 h-72 border-2 border-purple-300 rounded-full flex items-center justify-center">
          <div className="w-52 h-52 border-2 border-teal-300 rounded-full"></div>
        </div>
      </div>

      {/* Floating Icons */}
      <div className="absolute top-10 left-10 animate-pulse">
        <Circle className="text-white" size={30} />
      </div>
      <div className="absolute bottom-16 right-16 animate-spin">
        <Star className="text-yellow-400" size={35} />
      </div>
      <div className="absolute top-1/2 left-1/4 animate-bounce">
        <Sparkles className="text-pink-300" size={28} />
      </div>
      <div className="absolute top-1/4 right-1/3 animate-ping">
        <Globe className="text-green-400" size={25} />
      </div>

      {/* Story Section with Blur Background */}
      <div className="relative w-3/4 p-4 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl">
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex space-x-2 overflow-x-hidden py-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <motion.div
            className="flex space-x-2"
            drag="x"
            dragConstraints={{
              right: 0,
              left: -((story.length + 1) * 200) + containerRef.current?.offsetWidth,
            }}
          >
            <StoryCard isAddStory={true} />
            {story?.map((story) => (
              <StoryCard story={story} key={story._id} />
            ))}
          </motion.div>
        </div>

        {/* Left Scroll Button */}
        {scrollPosition > 0 && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full shadow-lg transition-opacity duration-300 ease-in-out"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Right Scroll Button */}
        {scrollPosition < maxScroll && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full shadow-lg transition-opacity duration-300 ease-in-out"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
    </>
  );
};

export default StorySection;
