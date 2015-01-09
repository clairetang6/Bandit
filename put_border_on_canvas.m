function put_border_on_canvas(canvas_png, i)

img = imread(canvas_png);

rows = size(img,1);
cols = size(img,2);

if(rows == 768)
    rows_to_add = 32;
    cols_to_add = 50;
else
    rows_to_add = 64;
    cols_to_add = 100;
end


new_img = uint8(zeros(rows+rows_to_add, cols+cols_to_add,3));
new_img(rows_to_add+1:end, cols_to_add+1:end, :) = img;

if(rows == 768)
    imwrite(uint8(new_img),strcat('canvas',num2str(i),'.png'),'png');
else
    imwrite(uint8(new_img),strcat('canvas',num2str(i),'@2x.png'),'png');
end
