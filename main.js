class Game{
	constructor(_html_id){
		this.pieces_controller = new Pieces_Controller()
		this.board_controller = new Board_Controller(22, 10, _html_id)
		this.board_controller.print_board()
	}
	detect_input(){
		
		let need_to_refresh_board_1 = this.pieces_controller.detect_manual_lock(this.board_controller)
		let need_to_refresh_board_2 = this.pieces_controller.detect_harddrop(this.board_controller)
		
		this.pieces_controller.detect_hold(this.board_controller)
		if(need_to_refresh_board_1 || need_to_refresh_board_2){
			this.board_controller.print_ghost(this.pieces_controller.ghost)
			this.board_controller.print_piece(this.pieces_controller.cur_piece)
		}
		let need_to_refresh_piece_1 = this.pieces_controller.detect_rotation(this.board_controller)
		let need_to_refresh_piece_2 = this.pieces_controller.control_LR_move(this.board_controller)
		let need_to_refresh_piece_3 = this.pieces_controller.detect_softdrop(this.board_controller)

		if(need_to_refresh_piece_1 || need_to_refresh_piece_2 || need_to_refresh_piece_3){
			this.board_controller.print_ghost(this.pieces_controller.ghost)
			this.board_controller.print_piece(this.pieces_controller.cur_piece)
			// this.board_controller.print_grid()
		}
		

	}
	try(){

	}
}



class Block{
	constructor(_x, _y, _id){
		this.coordinate = {x:_x, y:_y}
		this.block_id = _id
		this.relative_pos = {x:null, y:null}
	}
	rotate_block(_center_coordinate, _is_clockwise){
		this.relative_pos.x = this.coordinate.x - _center_coordinate.x
		this.relative_pos.y = this.coordinate.y - _center_coordinate.y

		let rotation_matrix = null
		if (_is_clockwise){
			rotation_matrix = [[0,1], [-1,0]]
		}
		else{
			rotation_matrix = [[0,-1], [1,0]]
		}
		let new_rel_pos_x = rotation_matrix[0][0] * this.relative_pos.x + rotation_matrix[0][1] * this.relative_pos.y
		let new_rel_pos_y = rotation_matrix[1][0] * this.relative_pos.x + rotation_matrix[1][1] * this.relative_pos.y

		this.coordinate.x = new_rel_pos_x + _center_coordinate.x
		this.coordinate.y = new_rel_pos_y + _center_coordinate.y
	}

}


class Piece{
	constructor(_center_x, _center_y, _piece_id){
	this.rotation_index = 0
    this.piece_id = _piece_id
    this.blocks = [] 
    this.center_coordinate = {x:_center_x, y:_center_y}
    // this.lock_delay_timer = 30
    this.offset_data = null

    if(this.piece_id=="O"){
		this.blocks = [ 
		new Block(_center_x, _center_y, "O"),
		new Block(_center_x+1, _center_y, "O"),
		new Block(_center_x, _center_y+1, "O"),
		new Block(_center_x+1, _center_y+1, "O") 
    ]}
        
    else if(this.piece_id=="I"){    
		this.blocks = [
	    new Block(_center_x, _center_y, "I"),
	    new Block(_center_x-1, _center_y, "I"),
	    new Block(_center_x+1, _center_y, "I"),
	    new Block(_center_x+2, _center_y, "I") 
    ]}
            
        
    else if(this.piece_id=="Z"){
    	this.blocks = [
        new Block(_center_x, _center_y, "Z"),
        new Block(_center_x+1, _center_y, "Z"),
        new Block(_center_x, _center_y+1, "Z"),
        new Block(_center_x-1, _center_y+1, "Z") 
    ]}
        
    else if(this.piece_id=="S"){
    	this.blocks = [
        new Block(_center_x, _center_y, "S"),
        new Block(_center_x-1, _center_y, "S"),
        new Block(_center_x, _center_y+1, "S"),
        new Block(_center_x+1, _center_y+1, "S") 
    ]}
        
    else if(this.piece_id=="J"){
    	this.blocks = [
        new Block(_center_x, _center_y, "J"),
        new Block(_center_x+1, _center_y, "J"),
        new Block(_center_x-1, _center_y, "J"),
        new Block(_center_x-1, _center_y+1, "J") 
    ]}
        
    else if(this.piece_id=="L"){
    	this.blocks = [
        new Block(_center_x, _center_y, "L"),
        new Block(_center_x-1, _center_y, "L"),
        new Block(_center_x+1, _center_y, "L"),
        new Block(_center_x+1, _center_y+1, "L") 
    ]}
        
    else if(this.piece_id=="T"){
    	this.blocks = [
        new Block(_center_x, _center_y, "T"),
        new Block(_center_x-1, _center_y, "T"),
        new Block(_center_x+1, _center_y, "T"),
        new Block(_center_x, _center_y+1, "T") 
    ]}
    
    if(this.piece_id=="O")
    {
        this.offset_data = [ [[0,0]], [[0,-1]], [[-1,-1]], [[-1,0]] ]
	}
    else if(this.piece_id=="I")
    {
        this.offset_data = [
        [[0,0], [-1,0], [2,0], [-1,0], [2,0]],
        [[-1,0], [0,0], [0,0], [0,1], [0,-2]],
        [[-1,1], [1,1], [-2,1], [1,0], [-2,0]],
        [[0,1], [0,1], [0,1], [0,-1], [0,2]] 
        ]
    }
    else{
        this.offset_data = [
        [[0,0], [0,0], [0,0], [0,0], [0,0]],
        [[0,0], [1,0], [1,-1], [0,2], [1,2]],
        [[0,0], [0,0], [0,0], [0,0], [0,0]],
        [[0,0], [-1,0], [-1,-1], [0,2], [-1,2]]
		]
	}
	}

	is_touching_ground(_board_controller){
	    // let is_touching = false
	    // for (let block of this.blocks){
	    //     let temp_x = block.coordinate.x
	    //     let temp_y = block.coordinate.y
	    //     if (temp_y==0 || (temp_y>0&&_board_controller.board[temp_x][temp_y]!=0)){
	    //     	is_touching=true
	    //     	break
	    //     }
	    // }
	    // return is_touching
	    return (!(this.can_move_piece([0,-1], _board_controller)===true))
	}





	move_piece(_offset){
		this.center_coordinate.x += _offset[0]
		this.center_coordinate.y += _offset[1]
		for (let block of this.blocks){
			block.coordinate.x += _offset[0]
			block.coordinate.y += _offset[1]
		}
	}

	can_move_piece(_offset, _board_controller){
		//这里传board还是boardcontroller有待商榷
		let test_result = true
		for (let block of this.blocks){
			let temp_x = block.coordinate.x + _offset[0]
			let temp_y = block.coordinate.y + _offset[1]
			// console.log(block.coordinate.x + ',' + block.coordinate.y)
			if (temp_x<0 || temp_y<0 || temp_x>=_board_controller.col || temp_y>=_board_controller.row){
				test_result = 'edge_collide'
				//撞边
				// console.log('cannot move')
				break
			}
			else if(_board_controller.board[temp_x][temp_y] != 0){
				//[temp_x][temp_y]这里暂时不知道要不要反过来
				test_result = 'block_collide'
				// console.log('cannot move')
				break
			}

		}
		return test_result
	}
	

	try_offset(_old_rotation_index, _rotation_index, _board_controller){
		let end_offset = [0,0]
		let move_possible = false
		for(let try_idx=0; try_idx<5; try_idx++){
			let offset_val_1 = this.offset_data[_old_rotation_index][try_idx]
	        let offset_val_2 = this.offset_data[_rotation_index][try_idx]
	        end_offset =  [offset_val_1[0]-offset_val_2[0], offset_val_1[1]-offset_val_2[1]]

	        if (this.can_move_piece(end_offset, _board_controller)===true){
	            move_possible = true
	            break
        	}
		}

        
	    if (move_possible){
	        this.move_piece(end_offset)
		}
	    else{
	        // console.log("cannot move")
	    }
	    return move_possible
	}

	


	rotate_piece(_is_clockwise, _should_offset, _board_controller){
		let old_rotation_index = this.rotation_index
		if (_is_clockwise){
		    this.rotation_index += 1
		}
		else{
			this.rotation_index -= 1
		}

		if (this.rotation_index==-1){
			this.rotation_index = 3
		}
		if (this.rotation_index==4){
		    this.rotation_index = 0
		}
  
    
    
		for(let i=0; i<4; i++){
		    this.blocks[i].rotate_block(this.blocks[0].coordinate, _is_clockwise)
		}



		if (_should_offset){
		    let can_offset = this.try_offset(old_rotation_index, this.rotation_index, _board_controller)
		// --        print(can_offset)
		// --        print("old" .. old_rotation_index,this.rotation_index)
		    
		    if (!can_offset){
		    	this.rotate_piece(!_is_clockwise, false, _board_controller)
		    }
		}
    
    
	}
}



class Pieces_Controller{
	constructor(){
	this.cur_piece = null
	this.ghost = []


    this.DAS = 8
    this.ARR = 0
    this.frame_timer = this.DAS
    this.timer_type = 0  //0, left, right
    
    this.soft_timer_type = 0 //0, soft
    this.soft_DAS = 0
    this.soft_ARR = 0
    this.soft_frame_timer = this.soft_DAS

    this.is_rotated_last_frame = 0

    this.manual_lock_last_frame = false
    this.piece_queue = []

    this.hold_id = 0

    this.harddrop_lock_last_frame = false

    this.hold_lock_last_frame = false
    this.hold_once_already = false
    this.hold_queue = []
	}
	ghost_go_down_by_one(){
		for (let coordinate of this.ghost){
			coordinate[1] -= 1
		}
	}
	ghost_go_up_by_one(){
		for (let coordinate of this.ghost){
			coordinate[1] += 1
		}
	}
	ghost_is_valid(_board_controller){
		let is_valid = true
		for (let coordinate of this.ghost){
			if(coordinate[0]<0){
				is_valid = false
				break
			}
			if(_board_controller.board[coordinate[0]][coordinate[1]]!=0){
				is_valid = false
				break
			}
		}
		return is_valid
		
		
	}
	update_ghost(_board_controller){
		_board_controller.wipe_ghost_piece(this.ghost)
		this.ghost = []
		for (var block of this.cur_piece.blocks){
			this.ghost.push([block.coordinate.x, block.coordinate.y])
		}


		while (true){
			this.ghost_go_down_by_one()
			if(!this.ghost_is_valid(_board_controller)){
				this.ghost_go_up_by_one()
				break
			}
		}

		// console.log('ghost:' + this.ghost.center_coordinate.x + ',' + this.ghost.center_coordinate.y)


	}



	detect_rotation(_board_controller){
		//detect rotate input
		let need_to_refresh = false
		let is_clockwise_down = kd.C.isDown()
    	let is_counter_down = kd.X.isDown()
    	if(is_clockwise_down && is_counter_down){
        	this.is_rotated_last_frame = 0//???
        	need_to_refresh = false
	        return need_to_refresh
        }
        if(is_clockwise_down){
	        if(this.is_rotated_last_frame!="clockwise"){
	        	_board_controller.wipe_piece(this.cur_piece)
	            this.cur_piece.rotate_piece(true,true, _board_controller)///para += board
	            this.is_rotated_last_frame="clockwise"//???
	            this.update_ghost(_board_controller)
		        need_to_refresh = true
		        return need_to_refresh
	        }
	        return need_to_refresh
    	}
    	if(is_counter_down){
	        if(this.is_rotated_last_frame!="counter"){
	        	_board_controller.wipe_piece(this.cur_piece)
	            this.cur_piece.rotate_piece(false,true, _board_controller)///para += board
	            this.is_rotated_last_frame="counter"//???
	            this.update_ghost(_board_controller)
		        need_to_refresh = true
		        return need_to_refresh
	        }
	        return need_to_refresh
    	}
    	if (!(is_clockwise_down || is_counter_down)){
    		this.is_rotated_last_frame = 0
    		need_to_refresh = false
	        return need_to_refresh
    	}

	}



	yield(_piece_id){
    	this.cur_piece = new Piece(4, 20, _piece_id) 
    	
	}

	control_LR_move(_board_controller){
		if (this.cur_piece==null){
			return
		}
		let need_to_refresh = false
		let is_L_down = kd.J.isDown()
		let is_R_down = kd.L.isDown()

		if(is_L_down&&is_R_down){
			this.frame_timer = this.DAS
			//timer_type？？？？
			return false
		}
		if (is_L_down){
			if(this.timer_type!='left'){
				if(this.cur_piece.can_move_piece([-1,0], _board_controller)===true){
					_board_controller.wipe_piece(this.cur_piece)
					this.cur_piece.move_piece([-1,0])
					this.update_ghost(_board_controller)
					this.timer_type = 'left'
					need_to_refresh = true
	        		return need_to_refresh
				}
				else if(this.cur_piece.can_move_piece([-1,0], _board_controller)=='edge_collide'){
					//如果在最左，且第一次按左，DAS清零，且不算时间
					this.frame_timer = this.DAS
					this.timer_type = 0//？？？？？？
					return need_to_refresh
				}

			}
			else{
				this.frame_timer -= 1
				if(this.frame_timer<=0){
					if(this.cur_piece.can_move_piece([-1,0], _board_controller)===true){
						_board_controller.wipe_piece(this.cur_piece)
						this.cur_piece.move_piece([-1,0])
						this.update_ghost(_board_controller)
						this.frame_timer = this.ARR
						need_to_refresh = true
	        			return need_to_refresh
					}
					else if(this.cur_piece.can_move_piece([-1,0], _board_controller)=='edge_collide'){
					//如果在最左，且不是第一次按左，DAS清零，且不算时间
						this.frame_timer = this.DAS
						this.timer_type = 0
						this.frame_timer = this.ARR
						return need_to_refresh
					}
				}
			}
		}
		if (is_R_down){
			if(this.timer_type!='right'){
				if(this.cur_piece.can_move_piece([1,0], _board_controller)===true){
					_board_controller.wipe_piece(this.cur_piece)
					this.cur_piece.move_piece([1,0])
					this.update_ghost(_board_controller)
					this.timer_type = 'right'
					need_to_refresh = true
					return need_to_refresh
				}
				else if(this.cur_piece.can_move_piece([1,0], _board_controller)=='edge_collide'){
					//如果在最右，且第一次按右，DAS清零，且不算时间
					this.frame_timer = this.DAS
					this.timer_type = 0//？？？？？？
					return need_to_refresh
				}

			}
			else{
				this.frame_timer -= 1
				if(this.frame_timer<=0){
					if(this.cur_piece.can_move_piece([1,0], _board_controller)===true){
						_board_controller.wipe_piece(this.cur_piece)
						this.cur_piece.move_piece([1,0])
						this.update_ghost(_board_controller)
						this.frame_timer = this.ARR
						need_to_refresh = true
						return need_to_refresh
					}
					else if(this.cur_piece.can_move_piece([1,0], _board_controller)=='edge_collide'){
					//如果在最右，且不是第一次按右，DAS清零，且不算时间
						this.frame_timer = this.DAS
						this.timer_type = 0
						this.frame_timer = this.ARR
						return need_to_refresh
					}
				}
			}
		}

		if(!(is_L_down||is_R_down)){
			this.frame_timer = this.DAS
			this.timer_type = 0
			return need_to_refresh
		}
	}

	detect_manual_lock(_board_controller){
		let need_to_refresh_board = false
		if(kd.SPACE.isDown()){
			if(!this.manual_lock_last_frame){
				for (let block of this.cur_piece.blocks){
		            let temp_x = block.coordinate.x
		            let temp_y = block.coordinate.y
		            _board_controller.board[temp_x][temp_y] = block.block_id
	        
    			}

    			_board_controller.check_clear_line(this.cur_piece, this.ghost)
    			
    			// this.cur_piece = null
    			// _board_controller.print_dropped_piece(this.cur_piece)
    			delete this.cur_piece///??????????
    			this.generate_piece(_board_controller)
    			need_to_refresh_board = true
    			this.manual_lock_last_frame = true
    			return need_to_refresh_board


			}
			this.manual_lock_last_frame = true
			return need_to_refresh_board
		}
		else{
			this.manual_lock_last_frame = false
			return need_to_refresh_board
		}

		// --    #######call check line clear and pass the piece to the function
		//     _board_controller:check_clear_line(this.cur_piece)
		//     this.cur_piece = nil
		//     this:generate_piece()
		//     end
	}

	detect_harddrop(_board_controller){
		let need_to_refresh_board = false
		if(kd.I.isDown()){
			if(!this.harddrop_lock_last_frame){
				for (let coordinate_tuple of this.ghost){
		            _board_controller.board[coordinate_tuple[0]][coordinate_tuple[1]] = this.cur_piece.piece_id
	        
    			}
    			_board_controller.wipe_piece(this.cur_piece)
    			// _board_controller.print_dropped_piece(this.ghost, this.cur_piece.piece_id)//画锁定的块要用到ghost的坐标

    			_board_controller.check_clear_line(this.cur_piece, this.ghost)
    			
    			// this.cur_piece = null
    			// _board_controller.print_dropped_piece(this.cur_piece)
    			this.generate_piece(_board_controller)

    			this.harddrop_lock_last_frame = true
    			need_to_refresh_board = true
    			return need_to_refresh_board


			}
			this.harddrop_lock_last_frame = true
			return need_to_refresh_board
		}
		else{
			this.harddrop_lock_last_frame = false
			return need_to_refresh_board
		}
	}

	detect_hold(_board_controller){

		if(kd.Z.isDown()){
			if(!this.hold_lock_last_frame){
				console.log('here')
				if(!this.hold_once_already){
					if (this.hold_queue.length == 0){
					_board_controller.wipe_piece(this.cur_piece)
					_board_controller.wipe_ghost_piece(this.ghost)
					this.hold_queue.push(this.cur_piece.piece_id)
					console.log(this.hold_queue)
					this.generate_piece(_board_controller)
					_board_controller.print_ghost(this.ghost)
					_board_controller.print_piece(this.cur_piece)
					this.hold_once_already = true
				}
				else{
					_board_controller.wipe_piece(this.cur_piece)
					_board_controller.wipe_ghost_piece(this.ghost)
					this.hold_queue.push(this.cur_piece.piece_id)

					this.yield(this.hold_queue.shift())
					this.ghost = []
					for (var block of this.cur_piece.blocks){
						this.ghost.push([block.coordinate.x, block.coordinate.y])
					}
					this.update_ghost(_board_controller)
	
					_board_controller.print_ghost(this.ghost)
					_board_controller.print_piece(this.cur_piece)
					this.hold_once_already = true
				}
				}
				var event = new CustomEvent("event_hold_changed", { "detail": this.hold_queue[0] });
    			document.dispatchEvent(event);



    			this.hold_lock_last_frame = true
    			// need_to_refresh_board = true
    			// return need_to_refresh_board


			}
			this.hold_lock_last_frame = true
			// return need_to_refresh_board
		}
		else{
			this.hold_lock_last_frame = false
			// return need_to_refresh_board
		}
	}

	detect_softdrop(_board_controller){
		let is_soft_down = kd.K.isDown()
		let need_to_refresh = false

		if (is_soft_down){
        	if (this.soft_timer_type!="soft"){
        		if (this.cur_piece.can_move_piece([0,-1],_board_controller)===true){
        			_board_controller.wipe_piece(this.cur_piece)
        			this.cur_piece.move_piece([0,-1])
                    this.soft_timer_type ="soft"
                    need_to_refresh = true
                    return need_to_refresh
                }
                return need_to_refresh
            }
	        else{
	        	this.soft_frame_timer -= 1
	            if (this.soft_frame_timer<=0){
	            	if (this.cur_piece.can_move_piece([0,-1],_board_controller)===true){
	            		_board_controller.wipe_piece(this.cur_piece)
	            		this.cur_piece.move_piece([0,-1])
	            		need_to_refresh = true
                    	return need_to_refresh
	            	}
	                this.soft_frame_timer = this.soft_ARR
	                return need_to_refresh
	            }
	        }
    	}
    	else{
    		this.soft_frame_timer = this.soft_DAS
    		return need_to_refresh
    	}
	}

	shuffle(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

		// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}

	generate_piece(_board_controller){
		let id_set = ["T", "O", "Z", "S", "I", "L", "J"]
		if(this.piece_queue.length <= 7){
			let bag = this.shuffle(id_set)
			this.piece_queue = this.piece_queue.concat(id_set)
		}
		this.yield(this.piece_queue.shift())
		this.ghost = []
		for (var block of this.cur_piece.blocks){
			this.ghost.push([block.coordinate.x, block.coordinate.y])
		}
		this.update_ghost(_board_controller)
		console.log('ghost of new block updated')
		_board_controller.print_piece(this.cur_piece)
		_board_controller.print_ghost(this.ghost)

		this.hold_once_already = false

		var event = new CustomEvent("event_next_queue_change", { "detail": this.piece_queue.slice(0,6) });
		document.dispatchEvent(event);
	}

}




	







// var board = document.getElementById('board');
// board.width  = 400;
// board.height = 800;
// var row_num = 20
// var col_num = 10
// var ctx = board.getContext('2d');
// ctx.strokeStyle = 'white';
// var block_size = 40
// ctx.lineWidth = 2;
// for (const col_idx of Array(col_num).keys()){
// 	ctx.beginPath();
// 	ctx.moveTo(col_idx*block_size, 0);
// 	ctx.lineTo(col_idx*block_size, row_num*block_size);
// 	ctx.stroke(); 
// }

// for (const row_idx of Array(row_num).keys()){
// 	ctx.beginPath();
// 	ctx.moveTo(0, row_idx*block_size);
// 	ctx.lineTo(col_num*block_size, row_idx*block_size);
// 	ctx.stroke(); 
// }

class Board_Controller{
	constructor(_row, _col, _html_id, _block_size = 40, ){
		this.canvas = document.getElementById(_html_id);
		this.ctx = this.canvas.getContext("2d");
		this.row = _row
    	this.col = _col
    	this.block_size = _block_size
    	this.board = []
    	for (var i = 0; i < this.col; i++){
    		this.board.push([])
    		for (var j = 0; j < this.row; j++){
    			this.board[i].push(0)
    		}
    	}
    	//10行20列的空白
    	this.ghost_color = 'lavender'
    	this.color = new Map()
		this.color.set('Z', 'rgb(255,0,0)')
		this.color.set('S', 'rgb(0,255,0)')
		this.color.set('J', 'rgb(0,60,255)')
		this.color.set('I', 'rgb(0,240,255)')
		this.color.set('L', 'rgb(255,180,0)')
		this.color.set('O', 'rgb(255,240,0)')
		this.color.set('T', 'rgb(220,0,255)')
		// this.color.set('W', 'rgb(0,0,0)')
		this.color.set(0, 'white')
		this.color.set('G', 'rgb(125,125,125)')
	}
	print(){
		let newParent = document.createElement('p')
		newParent.style.fontSize='14px'
		newParent.style.margin = 0
		newParent.style.fontWeight = 200
		let newElement = document.createElement('p')
		newElement.innerHTML = 'Board Status'
		newElement.style.fontWeight = 800
		newParent.appendChild(newElement)

		for (var j = this.row-1; j >= 0; j--){
			let newChild = document.createElement('p')
			var s = ''
    		for (var i = 0; i < this.col; i++){
    			s += this.board[i][j]
    			newChild.innerHTML = s
    			newChild.style.margin = 0
    			newParent.appendChild(newChild)
    		}
    	}
		return newParent
	}
	print_board(){
		// var canvas = document.getElementById('board');
		// var ctx = this.canvas.getContext("2d");
		
		this.canvas.width  = this.col * this.block_size
		this.canvas.height = this.row * this.block_size;
		for (var j = 0; j < this.row; j++){
    		for (var i = 0; i < this.col; i++){
    			

				if (this.board[i][j]!=0){
					this.ctx.fillStyle = this.color.get(this.board[i][j])
					this.ctx.fillRect(i*this.block_size, (this.row-j-1)*this.block_size, this.block_size, this.block_size)
				}

				// this.ctx.beginPath();
    			this.ctx.lineWidth = "2";
				// this.ctx.strokeStyle = this.color.get(this.board[i][j])
				this.ctx.strokeStyle = 'white'
				this.ctx.rect(i*this.block_size, (this.row-j-1)*this.block_size, 
					this.block_size, this.block_size)
				this.ctx.stroke();

    		}
    	}

	}



	print_grid(){
		// console.log('grid')
		// var canvas = document.getElementById('board');
		// var ctx = this.canvas.getContext("2d");
		
		// this.canvas.width  = 400;
		// this.canvas.height = 800;
		for (var j = 0; j < this.row; j++){
    		for (var i = 0; i < this.col; i++){
				// this.ctx.beginPath();
    			this.ctx.lineWidth = "2";
				this.ctx.strokeStyle = 'white'
				this.ctx.rect(i*this.block_size, (this.row-j-1)*this.block_size, 
				this.block_size, this.block_size)
				this.ctx.stroke();

    		}
    	}

	}

	print_block(_block){

		let x = _block.coordinate.x
		let y = _block.coordinate.y
		let block_color = this.color.get(_block.block_id)
		// console.log(x + ', ' + y )
		// var canvas = document.getElementById('board');
		// var ctx = this.canvas.getContext("2d");
		this.ctx.fillStyle = block_color
		this.ctx.fillRect(x*this.block_size, (this.row-y-1)*this.block_size, this.block_size, this.block_size)


	}

	wipe_block(_block){

		let x = _block.coordinate.x
		let y = _block.coordinate.y
		// let block_color = this.color.get(_block.block_id)
		// console.log(x + ', ' + y )
		// var canvas = document.getElementById('board');
		// var ctx = this.canvas.getContext("2d");
		// this.ctx.fillStyle = block_color
		this.ctx.clearRect(x*this.block_size, (this.row-y-1)*this.block_size, this.block_size, this.block_size)


	}

	wipe_ghost_block(_coordinate_tuple){
		this.ctx.clearRect(_coordinate_tuple[0]*this.block_size, (this.row-_coordinate_tuple[1]-1)*this.block_size, this.block_size, this.block_size)
	}

	print_piece(_piece){

		
		if (_piece!=null){
			// console.log('print_piece')

			for (let block of _piece.blocks){
				this.print_block(block)
			}
		}
	}

	print_ghost(_ghost){
			console.log('printing ghost')
		this.ctx.fillStyle = this.ghost_color
		for (let coordinate_tuple of _ghost){
			// this.wipe_ghost_block(coordinate_tuple)
			this.ctx.fillRect(coordinate_tuple[0]*this.block_size, (this.row-coordinate_tuple[1]-1)*this.block_size, this.block_size, this.block_size)
			}
	}

	print_dropped_piece(_coordinate_tuple_set, _piece_id){

			console.log('printing lite' + _coordinate_tuple_set)
		this.ctx.fillStyle = this.color.get(_piece_id)
		for (let coordinate_tuple of _coordinate_tuple_set){
			let x = coordinate_tuple[0]
			let y = coordinate_tuple[1]
			// this.wipe_ghost_block(coordinate_tuple)
			this.ctx.fillRect(x*this.block_size, (this.row-y-1)*this.block_size, this.block_size, this.block_size)
			}
	}

	wipe_piece(_piece){
		console.log('wipe piece at' + _piece.center_coordinate.x + ', ' +_piece.center_coordinate.y)
		if (_piece!=null){
			// console.log('wipe_piece')
			for (let block of _piece.blocks){
				this.wipe_block(block)
			}
		}
	}
	wipe_ghost_piece(_ghost){
		for (let coordinate_tuple of _ghost){
				this.wipe_ghost_block(coordinate_tuple)
			}
	}

	set_block(_row_idx, _col_idx, _type){
		if(_row_idx<this.row && _col_idx<this.col){
			this.board[_row_idx][_col_idx] = _type
		}
	}

	// check_clear_line(_piece){

	// 	const arrayColumn = (arr, n) => arr.map(x => x[n]);


	// 	let piece_y_idx = []
	// 	for (let block of _piece.blocks){
	// 		piece_y_idx.push(block.coordinate.y)
	// 	}
	// 	let line_full_y_idx = []
	// 	for (let y_idx of piece_y_idx){
	// 		if((arrayColumn(this.board, y_idx).every(item => item != 0))){
	// 			line_full_y_idx.push(y_idx)
	// 		}
	// 	}
		

	// 	let line_cleared_num = line_full_y_idx.length
	// 	let piece_id = _piece.piece_id
	// 	//////这里用来记录一些消行信息，以后用于统计


		
	// }

	check_clear_line(_piece, _ghost){

		const arrayColumn = (arr, n) => arr.map(x => x[n]);


		let piece_y_idx = []
		for (let block of _piece.blocks){
			piece_y_idx.push(block.coordinate.y)
		}

		let line_full_y_idx = []
		let cleared_board_transposed = []

		for(let y_idx = 0; y_idx < this.row; y_idx++){
			let row = arrayColumn(this.board, y_idx)
			if((row.every(item => item != 0))){
				line_full_y_idx.push(y_idx)
			}  
			else{
				cleared_board_transposed.push(row)
			}
		}


		let line_cleared_num = line_full_y_idx.length
		let piece_id = _piece.piece_id
		//////这里用来记录一些消行信息，以后用于统计

		for(let i=0; i<line_cleared_num; i++){
			cleared_board_transposed.push(new Array(this.col).fill(0))
		}

		this.board = cleared_board_transposed[0].map((_, colIndex) => cleared_board_transposed.map(row => row[colIndex]))
		// console.log(this.board)
		if(line_cleared_num > 0){
			this.print_board()
		}
		else{
			this.print_dropped_piece(_ghost, _piece.piece_id)//画锁定的块要用到ghost的坐标
		}
		

		
		
	}

	try(){
		var piece1 = new Piece(5,5,'T')
		piece1.rotate_piece(true, true, this)
		piece1.rotate_piece(true, true, this)
		this.print_piece(piece1)
	}

}



// var b = new Board_Controller(22,10, 'board')
// b.set_block(2,9,'T')
// b.set_block(3,5,'I')
// b.print_board()
// block1 = new Block(3,4,'S')
// b.print_block(block1)
// b.try()
// // piece1 = new Piece(5,5,'T')
// // piece1.rotate_piece(true,true, b)
// // b.print_piece(piece1)
// b.print_grid()
// var p = new Pieces_Controller()
// p.yield('J')
// b.print_piece(p.cur_piece)

// document.getElementById('try2').appendChild(b.print())

game = new Game('board')
game.pieces_controller.generate_piece(game.board_controller)


// document.onkeydown = function(e){
//     var keycode = window.event ? window.event.keyCode : e.which;
//     document.onkeyup = function(){
//     	console.log('less than 200'); 
//     };
//     if(keycode == 40){
//     	// var timer2 = null
//         var timer = setTimeout(function(){
//             // console.log('Down key held');
            
//             document.onkeyup = function(){
//             	console.log('more than 200'); 
//             };
//         }, 200); 
        
//         document.onkeyup = function(){
//             clearTimeout(timer);
//             // console.log('Down key pressed');   
//             // console.log('DAS');   
//         }

//         var timer2 = setTimeout(function(){
//             // console.log('Down key held');
//             console.log('ARR');
//             document.onkeyup = function(){};
//         }, 100); 
//         document.onkeyup = function(){
//             clearTimeout(timer2);
//             // console.log('Down key pressed');   
//             // console.log('DAS');   
//         }
//     }
// };





window.addEventListener("blur", handle_blur);

function handle_blur(){
	document.getElementById('focus_message').innerHTML = 'lost focus!'
	console.log('lost focus!')
}

window.addEventListener("focus", handle_focus);

function handle_focus(){
	document.getElementById('focus_message').innerHTML = 'focus!'
	console.log('focus!')
}

document.addEventListener('event_hold_changed', handle_event_hold_changed, false);
function handle_event_hold_changed(e){
	document.getElementById('hold_piece_id').innerHTML = e.detail
	console.log('hold id!!')
}


document.addEventListener('event_next_queue_change', handle_event_next_queue_change, false);
function handle_event_next_queue_change(e){
	document.getElementById('next_slots_1').innerHTML = e.detail[0]
	document.getElementById('next_slots_2').innerHTML = e.detail[1]
	document.getElementById('next_slots_3').innerHTML = e.detail[2]
	document.getElementById('next_slots_4').innerHTML = e.detail[3]
	document.getElementById('next_slots_5').innerHTML = e.detail[4]
	document.getElementById('next_slots_6').innerHTML = e.detail[5]
}

handle_event_next_queue_change


// document.addEventListener('event_hold_changed', handle_event_hold_changed, false);
// function handle_event_hold_changed(e){
// 	document.getElementById('hold_piece_id').innerHTML = e.detail
// 	console.log('hold id!!')
// }



// var Q = kd.Key(81)
var count = 0
var frameRate = 1000/60;
var lastFrame = 0;
var startTime;
// var d = new Date();
function mainLoop(time){  // time in ms accurate to 1 micro second 1/1,000,000th second
   var deltaTime = 0
   if(startTime === undefined){
       startTime = time;
   }else{
       const currentFrame = Math.round((time - startTime) / frameRate);
       deltaTime = (currentFrame - lastFrame) * frameRate;
       lastFrame = currentFrame;
   }
   kd.tick();
   count++;

   game.detect_input()
   // game.board_controller.print_piece(game.pieces_controller.cur_piece)

    // /detect_rotation()
// b.print_board()

// p.detect_rotation()





    // document.getElementById('try3').innerHTML = deltaTime + '///' + kd.SHIFT.isDown() + kd.Q.isDown()
    // console.log(deltaTime)
   requestAnimationFrame(mainLoop);
}
requestAnimationFrame(mainLoop);

var fpsOut = document.getElementById('fps');

setInterval(function(){
  fpsOut.innerHTML = count*2 + " fps";
  count = 0
},500);