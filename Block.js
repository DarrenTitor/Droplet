export class Block{
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