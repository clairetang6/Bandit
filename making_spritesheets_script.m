img = imread('bandit_spritesheet.png');
[img, map, alpha] = imread('bandit_spritesheet.png');
imagesc(img)
img_new = zeros(400,900,3);
img_new(1:250,1:900,:) = img; 

 
imagesc(uint8(img_new))
alpha_new = zeros(400, 900, 3);
alpha_new = zeros(400, 900);
alpha_new(1:250,1:900) = alpha;
 
[img, map, alpha] = imread('ghoul_2_left.png');
img_new(251:300,1:50,:) = img;
alpha_new(251:300,1:50) = alpha;
imagesc(uint8(img_new))
[img, map, alpha] = imread('ghoul_2_left_climb.png');
img_new(301:350,1:50,:) = img;
alpha_new(301:350,1:50) = alpha;
[img, map, alpha] = imread('ghoul_2_left_dead.png');
img_new(351:400,1:50,:) = img;
alpha_new(351:400,1:50) = alpha;
[img, map, alpha] = imread('ghoul_2_left_raised.png');
img_new(401:450,1:50,:) = img;
alpha_new(401:450,1:50) = alpha;
[img, map, alpha] = imread('ghoul_2_right.png');
img_new(451:500,1:50,:) = img;
alpha_new(451:500,1:50) = alpha;
[img, map, alpha] = imread('ghoul_2_right_climb.png');
imagesc(uint8(img_new))
img_new(251:300,51:100,:) = img;
alpha_new(251:300,51:100) = alpha;
[img, map, alpha] = imread('ghoul_2_right_dead.png');
img_new(301:350,51:100,:) = img;
alpha_new(301:350,51:100) = alpha;
[img, map, alpha] = imread('ghoul_2_right_raised.png');
img_new(351:400,51:100,:) = img;
alpha_new(351:400,51:100) = alpha;
[img, map, alpha] = imread('ghoul_3_left.png');
img_new(401:450,51:100,:) = img;
alpha_new(401:450,51:100) = alpha;
[img, map, alpha] = imread('ghoul_3_left_dead.png');
alpha_new(451:500,51:100) = alpha;
img_new(451:500,51:100,:) = img;
[img, map, alpha] = imread('ghoul_3_left_raised.png');
img_new(251:300,101:150,:) = img;
alpha_new(251:300,101:150) = alpha;
[img, map, alpha] = imread('ghoul_3_right.png');
img_new(301:350,101:150,:) = img;
alpha_new(301:350,101:150) = alpha;
[img, map, alpha] = imread('ghoul_3_right_dead.png');
img_new(351:400,101:150,:) = img;
alpha_new(351:400,101:150) = alpha;
[img, map, alpha] = imread('ghoul_3_right_raised.png');
img_new(401:450,101:150,:) = img;
alpha_new(401:450,101:150) = alpha;
[img, map, alpha] = imread('ghoul_3_stealth_1.png');
img_new(451:500,101:150,:) = img;
alpha_new(451:500,101:150) = alpha;
[img, map, alpha] = imread('ghoul_3_stealth_2.png');
img_new(251:300,151:200,:) = img;
alpha_new(251:300,151:200) = alpha;
[img, map, alpha] = imread('ghoul_3_stealth_3.png');
img_new(301:350,151:200,:) = img;
alpha_new(301:350,151:200) = alpha;
[img, map, alpha] = imread('ghoul_3_stealth_4.png');
img_new(351:400,151:200,:) = img;
alpha_new(351:400,151:200) = alpha;
[img, map, alpha] = imread('ghoul_3_stealth_5.png');
img_new(401:450,151:200,:) = img;
alpha_new(401:450,151:200) = alpha;
[img, map, alpha] = imread('ghoul_3_stealth_6.png');
img_new(451:500,151:200,:) = img;
alpha_new(451:500,151:200) = alpha;
imagesc(uint8(img_new))
[img, map, alpha] = imread('booze.png');
img_new(251:300,201:250,:) = img;
alpha_new(251:300,201:250) = alpha;
[img, map, alpha] = imread('honey.png');
img_new(251:300,251:300,:) = img;
alpha_new(251:300,251:300) = alpha;
[img, map, alpha] = imread('milk.png');
img_new(251:300,301:350,:) = img;
alpha_new(251:300,301:350) = alpha;
[img, map, alpha] = imread('OJ.png');
img_new(251:300,351:400,:) = img;
alpha_new(251:300,351:400) = alpha;
[img, map, alpha] = imread('red_wine.png');
img_new(251:300,401:450,:) = img;
alpha_new(251:300,401:450) = alpha;
[img, map, alpha] = imread('water.png');
img_new(251:300,451:500,:) = img;
alpha_new(251:300,451:500) = alpha;
[img, map, alpha] = imread('white_wine.png');
img_new(251:300,501:550,:) = img;
alpha_new(251:300,501:550) = alpha;
[img, map, alpha] = imread('tree_2.png');
img_new(251:300,551:600,:) = img;
alpha_new(251:300,551:600) = alpha;
[img, map, alpha] = imread('tree_3.png');
img_new(251:300,601:650,:) = img;
alpha_new(251:300,601:650) = alpha;

[img, map, alpha] = imread('zemerald_1.png');
img_new(251:300,651:700,:) = img;
alpha_new(251:300,651:700) = alpha;
imagesc(uint8(img_new))


img_new(301:350,401:900,:) = img_new(251:300,201:700,:);
imagesc(uint8(img_new))
alpha_new(301:350,401:900) = alpha_new(251:300,201:700);
img_new(251:300,201:400,:) = img_new(301:350,1:200,:);
alpha_new(251:300,201:400) = alpha_new(301:350,1:200);
img_new(251:300,401:600,:) = img_new(351:400,1:200,:);
alpha_new(251:300,401:600) = alpha_new(351:400,1:200);
img_new(251:300,601:800,:) = img_new(401:450,1:200,:);
alpha_new(251:300,601:800) = alpha_new(401:450,1:200);
img_new(251:300,801:900,:) = img_new(451:500,1:100,:);
alpha_new(251:300,801:900) = alpha_new(451:500,1:100);
img_new(301:350,201:300,:) = img_new(451:500,101:200,:);
alpha_new(301:350,201:300) = alpha_new(451:500,101:200);


imwrite(uint8(img_new),'bandit_spritesheet.png','Alpha',uint8(alpha_new));