use std::{fs, usize};

// Use `xxd -b  dbg-coords.out | sed 's/ \(\w\)/ 0b\1/g' | cut -d' ' -f 2-8 | sed 's/ /,/g'`
// to turn the data into a valid js array
fn main() {
    let grid_size: usize = std::env::args()
        .nth(1)
        .expect("no grid size provided")
        .parse()
        .unwrap();
    let snake_size: usize = std::env::args()
        .nth(2)
        .expect("no snake size provided")
        .parse()
        .unwrap();

    assert!(grid_size * grid_size >= snake_size);

    let mut data = Vec::new();

    for i in (0..grid_size * grid_size - (snake_size - 1)).rev() {
        let coord_byte_width = 8;
        let mut segs = vec![0; snake_size * coord_byte_width];
        for s in 0..snake_size {
            let y = (i + s) / grid_size;
            let x_mod = (i + s) % grid_size;
            let x = if y % 2 == grid_size % 2 {
                grid_size - (x_mod + 1)
            } else {
                x_mod
            };

            let seg_idx = (snake_size - (s + 1)) * coord_byte_width;
            let seg_x_bytes = (x as u32).to_be_bytes();
            let seg_y_bytes = (y as u32).to_be_bytes();

            segs[seg_idx..seg_idx + 4].copy_from_slice(&seg_x_bytes);
            segs[seg_idx + 4..seg_idx + 8].copy_from_slice(&seg_y_bytes);
        }

        data.append(&mut segs);

        let mut term = vec![255, 255, 255, 255];
        data.append(&mut term);
    }

    fs::write("dbg-coords.out", &data).unwrap();
}
