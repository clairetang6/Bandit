function make_row_of_blocks(block_png)

img = imread(block_png);
img(1:10,1:10,1)
width = size(img,2);
height = size(img,1);

col_img = 15*width;
row_of_blocks = zeros(height, col_img, 3);

for i = 1:15
    row_of_blocks(:,(i-1)*width+1:(i*width),:) = img;
    
end

imwrite(uint8(row_of_blocks),'Block_row.png','png');

end
