img = imread('bandit_spritesheet@2x.png');
[img, map, alpha] = imread('bandit_spritesheet@2x.png');
imagesc(img)
img_new = zeros(800,1800,3);
img_new(1:500,1:1800,:) = img; 

 
imagesc(uint8(img_new))
alpha_new = zeros(400, 900, 3);
alpha_new = zeros(800, 1800);
alpha_new(1:500,1:1800) = alpha;
 
[img, map, alpha] = imread('ghoul_2_left@2x.png');
img_new(501:600,1:100,:) = img;
alpha_new(501:600,1:100) = alpha;
imagesc(uint8(img_new))
[img, map, alpha] = imread('ghoul_2_left_climb@2x.png');
img_new(601:700,1:100,:) = img;
alpha_new(601:700,1:100) = alpha;
[img, map, alpha] = imread('ghoul_2_left_dead@2x.png');
img_new(701:800,1:100,:) = img;
alpha_new(701:800,1:100) = alpha;
[img, map, alpha] = imread('ghoul_2_left_raised@2x.png');
img_new(801:900,1:100,:) = img;
alpha_new(801:900,1:100) = alpha;
[img, map, alpha] = imread('ghoul_2_right@2x.png');
img_new(901:1000,1:100,:) = img;
alpha_new(901:1000,1:100) = alpha;
[img, map, alpha] = imread('ghoul_2_right_climb@2x.png');
imagesc(uint8(img_new))



img_new(501:600,101:200,:) = img;
alpha_new(501:600,101:200) = alpha;
[img, map, alpha] = imread('ghoul_2_right_dead@2x.png');
img_new(601:700,101:200,:) = img;
alpha_new(601:700,101:200) = alpha;
[img, map, alpha] = imread('ghoul_2_right_raised@2x.png');
img_new(701:800,101:200,:) = img;
alpha_new(701:800,101:200) = alpha;
[img, map, alpha] = imread('ghoul_3_left@2x.png');
img_new(801:900,101:200,:) = img;
alpha_new(801:900,101:200) = alpha;
[img, map, alpha] = imread('ghoul_3_left_dead@2x.png');
alpha_new(901:1000,101:200) = alpha;
img_new(901:1000,101:200,:) = img;

[img, map, alpha] = imread('ghoul_3_left_raised@2x.png');
img_new(501:600,201:300,:) = img;
alpha_new(501:600,201:300) = alpha;
[img, map, alpha] = imread('ghoul_3_right@2x.png');
img_new(601:700,201:300,:) = img;
alpha_new(601:700,201:300) = alpha;
[img, map, alpha] = imread('ghoul_3_right_dead@2x.png');
img_new(701:800,201:300,:) = img;
alpha_new(701:800,201:300) = alpha;
[img, map, alpha] = imread('ghoul_3_right_raised@2x.png');
img_new(801:900,201:300,:) = img;
alpha_new(801:900,201:300) = alpha;
[img, map, alpha] = imread('ghoul_3_stealth_1@2x.png');
img_new(901:1000,201:300,:) = img;
alpha_new(901:1000,201:300) = alpha;


[img, map, alpha] = imread('ghoul_3_stealth_2@2x.png');
img_new(501:600,301:400,:) = img;
alpha_new(501:600,301:400) = alpha;
[img, map, alpha] = imread('ghoul_3_stealth_3@2x.png');
img_new(601:700,301:400,:) = img;
alpha_new(601:700,301:400) = alpha;
[img, map, alpha] = imread('ghoul_3_stealth_4@2x.png');
img_new(701:800,301:400,:) = img;
alpha_new(701:800,301:400) = alpha;
[img, map, alpha] = imread('ghoul_3_stealth_5@2x.png');
img_new(801:900,301:400,:) = img;
alpha_new(801:900,301:400) = alpha;
[img, map, alpha] = imread('ghoul_3_stealth_6@2x.png');
img_new(901:1000,301:400,:) = img;
alpha_new(901:1000,301:400) = alpha;


[img, map, alpha] = imread('booze@2x.png')
img_new(501:600,401:500,:) = img;
alpha_new(501:600,401:500) = alpha;
[img, map, alpha] = imread('honey@2x.png');
img_new(501:600,501:600,:) = img;
alpha_new(501:600,501:600) = alpha;
[img, map, alpha] = imread('milk@2x.png');
img_new(501:600,601:700,:) = img;
alpha_new(501:600,601:700) = alpha;
[img, map, alpha] = imread('OJ@2x.png');
img_new(501:600,701:800,:) = img;
alpha_new(501:600,701:800) = alpha;
[img, map, alpha] = imread('red_wine@2x.png');
img_new(501:600,801:900,:) = img;
alpha_new(501:600,801:900) = alpha;
[img, map, alpha] = imread('water@2x.png');
img_new(501:600,901:1000,:) = img;
alpha_new(501:600,901:1000) = alpha;
[img, map, alpha] = imread('white_wine@2x.png');
img_new(501:600,1001:1100,:) = img;
alpha_new(501:600,1001:1100) = alpha;
[img, map, alpha] = imread('tree_2@2x.png');
img_new(501:600,1101:1200,:) = img;
alpha_new(501:600,1101:1200) = alpha;
[img, map, alpha] = imread('tree_3@2x.png');
img_new(501:600,1201:1300,:) = img;
alpha_new(501:600,1201:1300) = alpha;

[img, map, alpha] = imread('zemerald_1@2x.png');
img_new(501:600,1301:1400,:) = img;
alpha_new(501:600,1301:1400) = alpha;
imagesc(uint8(img_new))


img_new(601:700,801:1800,:) = img_new(501:600,401:1400,:);
imagesc(uint8(img_new))
alpha_new(601:700,801:1800) = alpha_new(501:600,401:1400);

img_new(501:600,401:800,:) = img_new(601:700,1:400,:);
alpha_new(501:600,401:800) = alpha_new(601:700,1:400);

img_new(501:600,801:1200,:) = img_new(701:800,1:400,:);
alpha_new(501:600,801:1200) = alpha_new(701:800,1:400);

img_new(501:600,1201:1600,:) = img_new(801:900,1:400,:);
alpha_new(501:600,1201:1600) = alpha_new(801:900,1:400);

img_new(501:600,1601:1800,:) = img_new(901:1000,1:200,:);
alpha_new(501:600,1601:1800) = alpha_new(901:1000,1:200);

img_new(601:700,401:600,:) = img_new(901:1000,201:400,:);
alpha_new(601:700,401:600) = alpha_new(901:1000,201:400);


imwrite(uint8(img_new),'bandit_spritesheet@2x.png','Alpha',uint8(alpha_new));





%%%%%
[img, map, alpha] = imread('bandit_spritesheet@2x.png');
img_new = img;
map_new = map;
alpha_new = alpha;
imagesc(img_new)

[img, map, alpha] = imread('ghoul_4_left.png');
img_new(351:400,1:50,:) = img;
alpha_new(351:400,1:50) = alpha;
imagesc(img_new)
[img, map, alpha] = imread('ghoul_4_left_climb.png');
img_new(351:400,51:100,:) = img;
alpha_new(351:400,51:100) = alpha;
[img, map, alpha] = imread('ghoul_4_left_dead.png');
img_new(351:400,101:150,:) = img;
alpha_new(351:400,101:150) = alpha;
[img, map, alpha] = imread('ghoul_4_left_gone1.png');
img_new(351:400,151:200,:) = img;
alpha_new(351:400,151:200) = alpha;
[img, map, alpha] = imread('ghoul_4_left_gone2.png');
img_new(351:400,201:250,:) = img;
alpha_new(351:400,201:250) = alpha;
[img, map, alpha] = imread('ghoul_4_left_gone3.png');
img_new(351:400,251:300,:) = img;
alpha_new(351:400,251:300) = alpha;
[img, map, alpha] = imread('ghoul_4_left_gone4.png');
img_new(351:400,301:350,:) = img;
alpha_new(351:400,301:350) = alpha;
[img, map, alpha] = imread('ghoul_4_gone5.png');
img_new(351:400,351:400,:) = img;
alpha_new(351:400,351:400) = alpha;
[img, map, alpha] = imread('ghoul_4_left_raised.png');
img_new(351:400,401:450,:) = img;
alpha_new(351:400,401:450) = alpha;
[img, map, alpha] = imread('ghoul_4_left_swing1.png');
img_new(351:400,451:500,:) = img;
alpha_new(351:400,451:500) = alpha;
[img, map, alpha] = imread('ghoul_4_left_swing2.png');
img_new(351:400,501:550,:) = img;
alpha_new(351:400,501:550) = alpha;
[img, map, alpha] = imread('ghoul_4_right.png');
img_new(351:400,551:600,:) = img;
alpha_new(351:400,551:600) = alpha;
[img, map, alpha] = imread('ghoul_4_right_climb.png');
img_new(351:400,601:650,:) = img;
alpha_new(351:400,601:650) = alpha;
[img, map, alpha] = imread('ghoul_4_right_dead.png');
img_new(351:400,651:700,:) = img;
alpha_new(351:400,651:700) = alpha;
[img, map, alpha] = imread('ghoul_4_right_gone1.png');
img_new(351:400,701:750,:) = img;
alpha_new(351:400,701:750) = alpha;
[img, map, alpha] = imread('ghoul_4_right_gone2.png');
img_new(351:400,751:800,:) = img;
alpha_new(351:400,751:800) = alpha;
[img, map, alpha] = imread('ghoul_4_right_gone3.png');
img_new(351:400,801:850,:) = img;
alpha_new(351:400,801:850) = alpha;
[img, map, alpha] = imread('ghoul_4_right_gone4.png');
img_new(351:400,851:900,:) = img;
alpha_new(351:400,851:900) = alpha;
[img, map, alpha] = imread('ghoul_4_right_raised.png');
img_new(401:450,1:50,:) = img;
alpha_new(401:450,1:50) = alpha;
[img, map, alpha] = imread('ghoul_4_right_swing1.png');
img_new(401:450,51:100,:) = img;
alpha_new(401:450,51:100) = alpha;
[img, map, alpha] = imread('ghoul_4_right_swing2.png');
img_new(401:450,101:150,:) = img;
alpha_new(401:450,101:150) = alpha;
imagesc(img_new)
imwrite(uint8(img_new),'bandit_spritesheet.png','Alpha',uint8(alpha_new));