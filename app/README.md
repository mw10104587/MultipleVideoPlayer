# MVP

## How to run the app
Open up [index.html](./html).
There are only **3** dependencies for this file.
2 js files including `script.js` and `dollar.js`.
1 css file: `style.css`

## Design Process
### The video interface
The first task is to come up with an interface that holds multiple videos. What came to my mind was the screen of a doorman, or a broadcast instructor's monitor. It has multiple small screens on it and gives the user an overview about all the screens. With this in mind, I decided to show four screens in a row and all user can append videos all the way down.

### The gesture input interface
I am not sure about the scenario when users are going to use gesture to control this interface but I do know that some of the laptops supports touch screen, and people can also use these gestures on their phone. I propose an overlay screen that lies on top of all the videos. By doing so, I maximized the canvas that the user can put there gesture, but also sacrificed the ability to let user input specific which video they're interacting. (By using a single gesture canvas for each video, we can easily identify which video to the user is interacting with) This added a lot of tasking for designing gestures to let user navigate between videos.


### The gestures
I categorized gestures into several categories. 
- Gestures that could be executed right away without specifying which video they're refering to.

| Function  | Gesture |
|-----------|---------|
| Add Video | A       |

I considered using `+` operator for adding video, but it gets confused with x pretty often. (I believe it depends on the habit of how you write as well). These two are very intuitive symbols. Usually, people thinks that `+` comes with a `-`. However, the library can't really recognize `-` as a symbol. The second symbol that's representative enough as a minus symbol would be pairing `+` and `x` for adding and deleting, but due to the problem mentioned, I decided to remove this kind of confusion. Thus removing all three of them `+`, `-`, `x`. 


- Gestures that helps user nevigate netween videos

| Function  |  Gesture  |
|-----------|-----------|
| Next Video| --->      |
| All Video | Circle    |

I believe by using circle to select all of the videos is a fair idea since it gives people the sense of wrapping all of these up. The arrow is a tricky decision. Arrow gives people the sense of **direction**, **pointing to this** and **next**. By using the last idea, I think it is a good choice to work as `the next video`. The downside of this is that you can't navigate videos row by row, which means when you're having a lot of videos, user have to spend a lot of time navigating to a specific video.

- Gesture that could be done specifying the videos to operate on

| Function   |   Gesture   |
|------------|-------------|
| Delete     | D           |
| Mute       | M           |
| Play       | Triangle    |
| Pause      | Square      |

For play and pause, I believe because it is very intuitive that you play with a triangle and pause with a square, so I kept the two decisions. For mute and delete, I decided to follow the practice of using the first character of the words to operate, just like what I did for add. It gives a little bit of consistency for these simple operations.


- Gestures that could specify the kind of operations we want to do one a certain subset of videos. These features are like the second round of spcification about what feature of the current focused video we want to modify. They are all continuous values here. This is related to the design decision I made for the following section of operations.

| Function   |   Gesture   |
|------------|-------------|
| Seek       | ~           |
| Size       | Star        |
| Speed      | zig-zag     |
| Volume     | Speaker     |




- Gestures that help identify the direction that we want to give the numeric values, these operations can be executed multiple times in a row, quickly changing the speed, volume, size or the current time of the video.

| Function  |  Gesture    |
|-----------|-------------|
| Increase  |  ^          |
| Decrease  |  v          |


### States of videos
While users interact with out application, we define a `focus` state for videos. If a video is currently under `focus` state, then the following operations will be on these videos. 

If a video is `focused`, but the operation that you want to do requires additional operation like adding or decreasing, you have to specify that feature before addding or decreasing. I show two examples to demonstrate the idea.

### Example
A common procedure of `adding three videos and playing only the second` requires a series of gesture like the following.
```
A, A, A, ->, ->, Triangle
```
The first three A's are obvious, the first arrow focus us on the first video and the second arrow gesture `defocus` the first video and `focus` on the second. The Triangle gesture plays the video that is currently under focus.


Another example of `adding two video, play both of them and speedup the second video`, requires the following operations.
```
A, A, Circle, Triangle, ->, ->, zig-zag, ^
```




## Heuristic Analysis