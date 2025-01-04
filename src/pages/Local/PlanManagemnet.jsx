import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import '../../assets/css/Local/PlanManagement.css';

// Hàm để reorder lại các item trong cùng một list
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

// Hàm để chuyển thẻ giữa các list
const move = (sourceList, destinationList, sourceIndex, destinationIndex) => {
  const sourceClone = Array.from(sourceList);
  const destClone = Array.from(destinationList);
  const [removed] = sourceClone.splice(sourceIndex, 1);
  destClone.splice(destinationIndex, 0, removed);
  return { sourceClone, destClone };
};

function PlanManagement() {
  const [boards, setBoards] = useState([
    {
      id: 'board-1',
      title: 'To Do',
      items: [
        { id: '1', content: 'Complete React project' },
        { id: '2', content: 'Prepare for exam' },
      ],
    },
    {
      id: 'board-2',
      title: 'In Progress',
      items: [
        { id: '3', content: 'Learn Redux' },
        { id: '4', content: 'Write documentation' },
      ],
    },
    {
      id: 'board-3',
      title: 'Completed',
      items: [
        { id: '5', content: 'Fix bugs in the app' },
        { id: '6', content: 'Write tests for app' },
      ],
    },
  ]);

  const deleteItem = (boardId, itemId) => {
    const newBoards = boards.map(board => {
      if (board.id === boardId) {
        return {
          ...board,
          items: board.items.filter(item => item.id !== itemId)
        };
      }
      return board;
    });
    setBoards(newBoards);
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // Nếu cùng một board, reorder các items trong board đó
    if (destination.droppableId === source.droppableId) {
      const board = boards.find(board => board.id === source.droppableId);
      const reorderedItems = reorder(board.items, source.index, destination.index);
      const newBoards = boards.map(b => 
        b.id === board.id ? { ...b, items: reorderedItems } : b
      );
      setBoards(newBoards);
    } else {
      // Di chuyển thẻ giữa các boards
      const sourceBoard = boards.find(board => board.id === source.droppableId);
      const destinationBoard = boards.find(board => board.id === destination.droppableId);

      const { sourceClone, destClone } = move(
        sourceBoard.items,
        destinationBoard.items,
        source.index,
        destination.index
      );

      const newBoards = boards.map(board => {
        if (board.id === sourceBoard.id) {
          return { ...board, items: sourceClone };
        } else if (board.id === destinationBoard.id) {
          return { ...board, items: destClone };
        }
        return board;
      });

      setBoards(newBoards);
    }
  };

  return (
    <div className="plan-management-custom">
      <h2 className="plan-management-title-custom">Plan Management</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="boards-container-custom">
          {boards.map((board) => (
            <Droppable key={board.id} droppableId={board.id} direction="vertical">
              {(provided) => (
                <div
                  className="board-custom"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h3 className="board-title-custom">{board.title}</h3>
                  <div className="board-items-custom">
                    {board.items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div
                            className="card-custom"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <p className="card-content-custom">{item.content}</p>
                            <button onClick={() => deleteItem(board.id, item.id)}>Delete</button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default PlanManagement;
