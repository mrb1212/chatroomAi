import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/src/redux/stores/store';
import { ListChatRooms, selectChatRoom } from '@/src/redux/actions/chatActions';
import { MessageSquare } from 'lucide-react';
import './ChatRoomList.scss';

export const ChatRoomList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { rooms, listChatRoomsLoading } = useSelector((state: RootState) => state.chat);
  const selectedRoom = useSelector((state: RootState) => state.chat.selectedRoom);

  useEffect(() => {
    const fetchChatRooms = async () => {
      await dispatch(ListChatRooms());
    };
    fetchChatRooms();
  }, [dispatch]);



  if (listChatRoomsLoading === "sending") {
    return <div className="chat-rooms-loading">در حال بارگذاری گفتگوها...</div>;
  }

  return (
    <div className="chat-rooms-list">
      {rooms?.length > 0 ? (
        rooms.map((room: any) => (
          <div
            key={room.id}
            className={`chat-room-item ${selectedRoom?.id === room.id ? 'selected' : ''}`}
            onClick={() => dispatch(selectChatRoom(room))}
          >
            <MessageSquare size={20} />
            <div className="room-info">
              <h3>{room.name}</h3>
              <p>{room.lastMessage?.content || 'بدون پیام'}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="no-chats">
          <MessageSquare size={24} />
          <p>هنوز گفتگویی ندارید</p>
        </div>
      )}
    </div>
  );
};
