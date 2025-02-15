import React, { useEffect } from "react";
import { UserPlus, X, Check, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFriendRequests,
  acceptFriendRequest,
  deleteRequest,
} from "../features/friendsSlice";
import { backendUrl } from "../config";

export function Notifications({}) {
  const dispatch = useDispatch();
  const { friendRequests: requests } = useSelector((state) => state.friends);
  useEffect(() => {
    dispatch(getFriendRequests());
  }, [dispatch]);
  console.log(requests);
  if (requests && requests.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <UserPlus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p>No pending friend requests</p>
      </div>
    );
  }
  return (
    <div className="divide-y divide-gray-100">
      {requests &&
        requests.map((request) => (
          <div
            key={request.id}
            className="p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {request.avatar ? (
                <img
                  src={`${backendUrl}/${request.avatar}`}
                  alt={request.userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-gray-500" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900">{request.userName}</h3>
              <p className="text-sm text-gray-500">
                Sent
                {request.createdAt}
              </p>
            </div>

            <div className="flex gap-2">
              {console.log(request.id)}
              <button
                onClick={async() => {
                  await dispatch(acceptFriendRequest(request.requestId)),
                  await dispatch(deleteRequest(request.id)),
                    dispatch(getFriendRequests());
                }}
                className="p-2 bg-transparent text-green-600 hover:bg-green-50 rounded-full transition-colors"
                title="Accept request"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={async() => {
                  await dispatch(deleteRequest(request.id)),
                    dispatch(getFriendRequests());
                }}
                className="p-2 bg-transparent text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Decline request"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Notifications;
