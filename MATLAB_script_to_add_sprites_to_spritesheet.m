img = imread('all_spritesheet.png');
imagesc(img);
[img, map, alpha] = imread('all_spritesheet.png');
[red_death, map_red_death, red_death_alpha] = imread('red_death.png');
[blue_death, map_blue_death, blue_death_alpha] = imread('blue_death.png');
[red_heart, map_red_heart, red_heart_alpha] = imread('red_heart.png');
[blue_heart, map_blue_heart, blue_heart_alpha] = imread('blue_heart.png');

img(55:108,217:270,:) = red_death;
img(55:108,271:324,:) = blue_death;
img(55:108,325:378,:) = red_heart;
img(55:108,379:432,:) = blue_heart;
alpha(55:108,217:270,:) = red_death_alpha;
alpha(55:108,271:324,:) = blue_death_alpha;
alpha(55:108,325:378,:) = red_heart_alpha;
alpha(55:108,379:432,:) = blue_heart_alpha;
imagesc(img)