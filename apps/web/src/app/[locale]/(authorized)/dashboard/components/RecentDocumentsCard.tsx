import { IGetUserDocumentsResponse } from "@/app/api/document/get-user-documents/[userId]/route";
import SlideLeftBtn from "@/components/SlideLeftBtn";
import SlideRightBtn from "@/components/SlideRightBtn";
import revalidate_tags from "@/constants/revalidate_tags";
import { api_user_documents } from "@/constants/urls";
import { getUserId } from "@/utils/get_data_server";
import Link from "next/link";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import DocumentCard from "../../my-documents/components/document-card/DocumentCard";

const RecentDocumentsCard = async () => {
  const userDocuments = (await fetch(`${api_user_documents}/${await getUserId()}`, {
    cache: "force-cache",
    next: { tags: [`${revalidate_tags.get_user_documents_}${await getUserId()}`] },
  }).then((data) => data.json())) as IGetUserDocumentsResponse[];

  return (
    <div className="bg-primary-50/5 flex flex-col rounded">
      {userDocuments.length > 0 && (
        <div className="flex justify-between items-center gap-2.5">
          <h6 className="p-2.5">Recent documents</h6>

          <Link
            href={"/my-documents"}
            className="text-xs flex items-center px-2.5 py-1.5 rounded-full hover:bg-forground/10 active:text-primary-500"
          >
            View All ({userDocuments.length}) <MdOutlineKeyboardArrowRight className="size-4" />
          </Link>
        </div>
      )}

      <div className="flex gap-2 px-2.5 pb-2.5 sm:gap-3 md:gap-3.5 lg:gap-4 sm:px-4.5 sm:pb-4.5 overflow-x-auto scrollbar-hidden snap-x snap-mandatory scroll-smooth relative">
        <SlideLeftBtn />

        {userDocuments.map((document) => (
          <DocumentCard key={document._id} document={document} display="inside-category" />
        ))}

        <SlideRightBtn />

        {userDocuments.length === 0 && (
          <h6 className="w-full min-h-30 flex justify-center items-center text-center">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            You didn't create any pdf yet!
          </h6>
        )}
      </div>
    </div>
  );
};

export default RecentDocumentsCard;
