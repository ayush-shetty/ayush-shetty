"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MdArrowOutward } from "react-icons/md";
import { Content } from "@prismicio/client";

gsap.registerPlugin(ScrollTrigger);

type ContentListProps = {
  items: Content.BlogPostDocument[] | Content.ProjectDocument[];
  contentType: Content.ContentIndexSlice["primary"]["content_type"];
  viewMoreText: Content.ContentIndexSlice["primary"]["view_more_text"];
};

export default function ContentList({
  items,
  contentType,
  viewMoreText = "Read More",
}: ContentListProps) {
  const component = useRef(null);
  const itemsRef = useRef<Array<HTMLLIElement | null>>([]);

  const urlPrefix = contentType === "Blog" ? "/blog" : "/project";

  useEffect(() => {
    // Animate list-items in with a stagger
    let ctx = gsap.context(() => {
      itemsRef.current.forEach((item, index) => {
        gsap.fromTo(
          item,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.3,
            ease: "elastic.out(1,0.3)",
            stagger: 0.2,
            scrollTrigger: {
              trigger: item,
              start: "top bottom-=100px",
              end: "bottom center",
              toggleActions: "play none none none",
            },
          },
        );
      });

      return () => ctx.revert(); // cleanup!
    }, component);
  }, []);

  return (
    <ul
      ref={component}
      className="grid border-b border-b-slate-100"
    >
      {items.map((post, index) => (
        <li
          key={index}
          ref={(el: HTMLLIElement | null) => {
            if (itemsRef.current) {
              itemsRef.current[index] = el;
            }
          }}
          className="list-item opacity-0"
        >
          <a
            href={`${urlPrefix}/${post.uid}`}
            className="flex flex-col justify-between border-t border-t-slate-100 py-10  text-slate-200 md:flex-row"
            aria-label={post.data.title || ""}
          >
            <div className="flex flex-col">
              <span className="text-3xl font-bold">{post.data.title}</span>
              <div className="flex gap-3 text-yellow-400">
                {post.tags.map((tag, index) => (
                  <span key={index} className="text-lg font-bold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <span className="ml-auto flex items-center gap-2 text-xl font-medium md:ml-0">
              {viewMoreText} <MdArrowOutward />
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}