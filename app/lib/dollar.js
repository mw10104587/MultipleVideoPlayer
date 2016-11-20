/**
 * The $1 Unistroke Recognizer (JavaScript version)
 *
 *	Jacob O. Wobbrock, Ph.D.
 * 	The Information School
 *	University of Washington
 *	Seattle, WA 98195-2840
 *	wobbrock@uw.edu
 *
 *	Andrew D. Wilson, Ph.D.
 *	Microsoft Research
 *	One Microsoft Way
 *	Redmond, WA 98052
 *	awilson@microsoft.com
 *
 *	Yang Li, Ph.D.
 *	Department of Computer Science and Engineering
 * 	University of Washington
 *	Seattle, WA 98195-2840
 * 	yangli@cs.washington.edu
 *
 * The academic publication for the $1 recognizer, and what should be 
 * used to cite it, is:
 *
 *	Wobbrock, J.O., Wilson, A.D. and Li, Y. (2007). Gestures without 
 *	  libraries, toolkits or training: A $1 recognizer for user interface 
 *	  prototypes. Proceedings of the ACM Symposium on User Interface 
 *	  Software and Technology (UIST '07). Newport, Rhode Island (October 
 *	  7-10, 2007). New York: ACM Press, pp. 159-168.
 *
 * The Protractor enhancement was separately published by Yang Li and programmed 
 * here by Jacob O. Wobbrock:
 *
 *	Li, Y. (2010). Protractor: A fast and accurate gesture
 *	  recognizer. Proceedings of the ACM Conference on Human
 *	  Factors in Computing Systems (CHI '10). Atlanta, Georgia
 *	  (April 10-15, 2010). New York: ACM Press, pp. 2169-2172.
 *
 * This software is distributed under the "New BSD License" agreement:
 *
 * Copyright (C) 2007-2012, Jacob O. Wobbrock, Andrew D. Wilson and Yang Li.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *    * Redistributions of source code must retain the above copyright
 *      notice, this list of conditions and the following disclaimer.
 *    * Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 *    * Neither the names of the University of Washington nor Microsoft,
 *      nor the names of its contributors may be used to endorse or promote
 *      products derived from this software without specific prior written
 *      permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL Jacob O. Wobbrock OR Andrew D. Wilson
 * OR Yang Li BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
 * OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
**/
//
// Point class
//
function Point(x, y) // constructor
{
	this.X = x;
	this.Y = y;
}
//
// Rectangle class
//
function Rectangle(x, y, width, height) // constructor
{
	this.X = x;
	this.Y = y;
	this.Width = width;
	this.Height = height;
}
//
// Unistroke class: a unistroke template
//
function Unistroke(name, points) // constructor
{
	this.Name = name;
	this.Points = Resample(points, NumPoints);
	var radians = IndicativeAngle(this.Points);
	this.Points = RotateBy(this.Points, -radians);
	this.Points = ScaleTo(this.Points, SquareSize);
	this.Points = TranslateTo(this.Points, Origin);
	this.Vector = Vectorize(this.Points); // for Protractor
}
//
// Result class
//
function Result(name, score) // constructor
{
	this.Name = name;
	this.Score = score;
}
//
// DollarRecognizer class constants
//
var NumUnistrokes = 26;
var NumPoints = 64;
var SquareSize = 250.0;
var Origin = new Point(0,0);
var Diagonal = Math.sqrt(SquareSize * SquareSize + SquareSize * SquareSize);
var HalfDiagonal = 0.5 * Diagonal;
var AngleRange = Deg2Rad(45.0);
var AnglePrecision = Deg2Rad(2.0);
var Phi = 0.5 * (-1.0 + Math.sqrt(5.0)); // Golden Ratio
//
// DollarRecognizer class
//
function DollarRecognizer() // constructor
{
	//
	// one built-in unistroke per gesture type
	//
	this.Unistrokes = new Array(NumUnistrokes);
	this.Unistrokes[0]  = new Unistroke("triangle", new Array(new Point(137,139),new Point(135,141),new Point(133,144),new Point(132,146),new Point(130,149),new Point(128,151),new Point(126,155),new Point(123,160),new Point(120,166),new Point(116,171),new Point(112,177),new Point(107,183),new Point(102,188),new Point(100,191),new Point(95,195),new Point(90,199),new Point(86,203),new Point(82,206),new Point(80,209),new Point(75,213),new Point(73,213),new Point(70,216),new Point(67,219),new Point(64,221),new Point(61,223),new Point(60,225),new Point(62,226),new Point(65,225),new Point(67,226),new Point(74,226),new Point(77,227),new Point(85,229),new Point(91,230),new Point(99,231),new Point(108,232),new Point(116,233),new Point(125,233),new Point(134,234),new Point(145,233),new Point(153,232),new Point(160,233),new Point(170,234),new Point(177,235),new Point(179,236),new Point(186,237),new Point(193,238),new Point(198,239),new Point(200,237),new Point(202,239),new Point(204,238),new Point(206,234),new Point(205,230),new Point(202,222),new Point(197,216),new Point(192,207),new Point(186,198),new Point(179,189),new Point(174,183),new Point(170,178),new Point(164,171),new Point(161,168),new Point(154,160),new Point(148,155),new Point(143,150),new Point(138,148),new Point(136,148)));
	this.Unistrokes[1]  = new Unistroke("x", new Array(new Point(87,142),new Point(89,145),new Point(91,148),new Point(93,151),new Point(96,155),new Point(98,157),new Point(100,160),new Point(102,162),new Point(106,167),new Point(108,169),new Point(110,171),new Point(115,177),new Point(119,183),new Point(123,189),new Point(127,193),new Point(129,196),new Point(133,200),new Point(137,206),new Point(140,209),new Point(143,212),new Point(146,215),new Point(151,220),new Point(153,222),new Point(155,223),new Point(157,225),new Point(158,223),new Point(157,218),new Point(155,211),new Point(154,208),new Point(152,200),new Point(150,189),new Point(148,179),new Point(147,170),new Point(147,158),new Point(147,148),new Point(147,141),new Point(147,136),new Point(144,135),new Point(142,137),new Point(140,139),new Point(135,145),new Point(131,152),new Point(124,163),new Point(116,177),new Point(108,191),new Point(100,206),new Point(94,217),new Point(91,222),new Point(89,225),new Point(87,226),new Point(87,224)));
	this.Unistrokes[2]  = new Unistroke("pause", new Array(new Point(78,149),new Point(78,153),new Point(78,157),new Point(78,160),new Point(79,162),new Point(79,164),new Point(79,167),new Point(79,169),new Point(79,173),new Point(79,178),new Point(79,183),new Point(80,189),new Point(80,193),new Point(80,198),new Point(80,202),new Point(81,208),new Point(81,210),new Point(81,216),new Point(82,222),new Point(82,224),new Point(82,227),new Point(83,229),new Point(83,231),new Point(85,230),new Point(88,232),new Point(90,233),new Point(92,232),new Point(94,233),new Point(99,232),new Point(102,233),new Point(106,233),new Point(109,234),new Point(117,235),new Point(123,236),new Point(126,236),new Point(135,237),new Point(142,238),new Point(145,238),new Point(152,238),new Point(154,239),new Point(165,238),new Point(174,237),new Point(179,236),new Point(186,235),new Point(191,235),new Point(195,233),new Point(197,233),new Point(200,233),new Point(201,235),new Point(201,233),new Point(199,231),new Point(198,226),new Point(198,220),new Point(196,207),new Point(195,195),new Point(195,181),new Point(195,173),new Point(195,163),new Point(194,155),new Point(192,145),new Point(192,143),new Point(192,138),new Point(191,135),new Point(191,133),new Point(191,130),new Point(190,128),new Point(188,129),new Point(186,129),new Point(181,132),new Point(173,131),new Point(162,131),new Point(151,132),new Point(149,132),new Point(138,132),new Point(136,132),new Point(122,131),new Point(120,131),new Point(109,130),new Point(107,130),new Point(90,132),new Point(81,133),new Point(76,133)));
	this.Unistrokes[3]  = new Unistroke("all", new Array(new Point(127,141),new Point(124,140),new Point(120,139),new Point(118,139),new Point(116,139),new Point(111,140),new Point(109,141),new Point(104,144),new Point(100,147),new Point(96,152),new Point(93,157),new Point(90,163),new Point(87,169),new Point(85,175),new Point(83,181),new Point(82,190),new Point(82,195),new Point(83,200),new Point(84,205),new Point(88,213),new Point(91,216),new Point(96,219),new Point(103,222),new Point(108,224),new Point(111,224),new Point(120,224),new Point(133,223),new Point(142,222),new Point(152,218),new Point(160,214),new Point(167,210),new Point(173,204),new Point(178,198),new Point(179,196),new Point(182,188),new Point(182,177),new Point(178,167),new Point(170,150),new Point(163,138),new Point(152,130),new Point(143,129),new Point(140,131),new Point(129,136),new Point(126,139)));
	this.Unistrokes[4]  = new Unistroke("check", new Array(new Point(91,185),new Point(93,185),new Point(95,185),new Point(97,185),new Point(100,188),new Point(102,189),new Point(104,190),new Point(106,193),new Point(108,195),new Point(110,198),new Point(112,201),new Point(114,204),new Point(115,207),new Point(117,210),new Point(118,212),new Point(120,214),new Point(121,217),new Point(122,219),new Point(123,222),new Point(124,224),new Point(126,226),new Point(127,229),new Point(129,231),new Point(130,233),new Point(129,231),new Point(129,228),new Point(129,226),new Point(129,224),new Point(129,221),new Point(129,218),new Point(129,212),new Point(129,208),new Point(130,198),new Point(132,189),new Point(134,182),new Point(137,173),new Point(143,164),new Point(147,157),new Point(151,151),new Point(155,144),new Point(161,137),new Point(165,131),new Point(171,122),new Point(174,118),new Point(176,114),new Point(177,112),new Point(177,114),new Point(175,116),new Point(173,118)));
	this.Unistrokes[5]  = new Unistroke("up", new Array(new Point(79,245),new Point(79,242),new Point(79,239),new Point(80,237),new Point(80,234),new Point(81,232),new Point(82,230),new Point(84,224),new Point(86,220),new Point(86,218),new Point(87,216),new Point(88,213),new Point(90,207),new Point(91,202),new Point(92,200),new Point(93,194),new Point(94,192),new Point(96,189),new Point(97,186),new Point(100,179),new Point(102,173),new Point(105,165),new Point(107,160),new Point(109,158),new Point(112,151),new Point(115,144),new Point(117,139),new Point(119,136),new Point(119,134),new Point(120,132),new Point(121,129),new Point(122,127),new Point(124,125),new Point(126,124),new Point(129,125),new Point(131,127),new Point(132,130),new Point(136,139),new Point(141,154),new Point(145,166),new Point(151,182),new Point(156,193),new Point(157,196),new Point(161,209),new Point(162,211),new Point(167,223),new Point(169,229),new Point(170,231),new Point(173,237),new Point(176,242),new Point(177,244),new Point(179,250),new Point(181,255),new Point(182,257)));
	this.Unistrokes[6]  = new Unistroke("playbackSpeed", new Array(new Point(307,216),new Point(333,186),new Point(356,215),new Point(375,186),new Point(399,216),new Point(418,186)));
	this.Unistrokes[7]  = new Unistroke("arrow", new Array(new Point(68,222),new Point(70,220),new Point(73,218),new Point(75,217),new Point(77,215),new Point(80,213),new Point(82,212),new Point(84,210),new Point(87,209),new Point(89,208),new Point(92,206),new Point(95,204),new Point(101,201),new Point(106,198),new Point(112,194),new Point(118,191),new Point(124,187),new Point(127,186),new Point(132,183),new Point(138,181),new Point(141,180),new Point(146,178),new Point(154,173),new Point(159,171),new Point(161,170),new Point(166,167),new Point(168,167),new Point(171,166),new Point(174,164),new Point(177,162),new Point(180,160),new Point(182,158),new Point(183,156),new Point(181,154),new Point(178,153),new Point(171,153),new Point(164,153),new Point(160,153),new Point(150,154),new Point(147,155),new Point(141,157),new Point(137,158),new Point(135,158),new Point(137,158),new Point(140,157),new Point(143,156),new Point(151,154),new Point(160,152),new Point(170,149),new Point(179,147),new Point(185,145),new Point(192,144),new Point(196,144),new Point(198,144),new Point(200,144),new Point(201,147),new Point(199,149),new Point(194,157),new Point(191,160),new Point(186,167),new Point(180,176),new Point(177,179),new Point(171,187),new Point(169,189),new Point(165,194),new Point(164,196)));
	this.Unistrokes[8]  = new Unistroke("left square bracket", new Array(new Point(140,124),new Point(138,123),new Point(135,122),new Point(133,123),new Point(130,123),new Point(128,124),new Point(125,125),new Point(122,124),new Point(120,124),new Point(118,124),new Point(116,125),new Point(113,125),new Point(111,125),new Point(108,124),new Point(106,125),new Point(104,125),new Point(102,124),new Point(100,123),new Point(98,123),new Point(95,124),new Point(93,123),new Point(90,124),new Point(88,124),new Point(85,125),new Point(83,126),new Point(81,127),new Point(81,129),new Point(82,131),new Point(82,134),new Point(83,138),new Point(84,141),new Point(84,144),new Point(85,148),new Point(85,151),new Point(86,156),new Point(86,160),new Point(86,164),new Point(86,168),new Point(87,171),new Point(87,175),new Point(87,179),new Point(87,182),new Point(87,186),new Point(88,188),new Point(88,195),new Point(88,198),new Point(88,201),new Point(88,207),new Point(89,211),new Point(89,213),new Point(89,217),new Point(89,222),new Point(88,225),new Point(88,229),new Point(88,231),new Point(88,233),new Point(88,235),new Point(89,237),new Point(89,240),new Point(89,242),new Point(91,241),new Point(94,241),new Point(96,240),new Point(98,239),new Point(105,240),new Point(109,240),new Point(113,239),new Point(116,240),new Point(121,239),new Point(130,240),new Point(136,237),new Point(139,237),new Point(144,238),new Point(151,237),new Point(157,236),new Point(159,237)));
	this.Unistrokes[9]  = new Unistroke("right square bracket", new Array(new Point(112,138),new Point(112,136),new Point(115,136),new Point(118,137),new Point(120,136),new Point(123,136),new Point(125,136),new Point(128,136),new Point(131,136),new Point(134,135),new Point(137,135),new Point(140,134),new Point(143,133),new Point(145,132),new Point(147,132),new Point(149,132),new Point(152,132),new Point(153,134),new Point(154,137),new Point(155,141),new Point(156,144),new Point(157,152),new Point(158,161),new Point(160,170),new Point(162,182),new Point(164,192),new Point(166,200),new Point(167,209),new Point(168,214),new Point(168,216),new Point(169,221),new Point(169,223),new Point(169,228),new Point(169,231),new Point(166,233),new Point(164,234),new Point(161,235),new Point(155,236),new Point(147,235),new Point(140,233),new Point(131,233),new Point(124,233),new Point(117,235),new Point(114,238),new Point(112,238)));
	this.Unistrokes[10] = new Unistroke("down", new Array(new Point(89,164),new Point(90,162),new Point(92,162),new Point(94,164),new Point(95,166),new Point(96,169),new Point(97,171),new Point(99,175),new Point(101,178),new Point(103,182),new Point(106,189),new Point(108,194),new Point(111,199),new Point(114,204),new Point(117,209),new Point(119,214),new Point(122,218),new Point(124,222),new Point(126,225),new Point(128,228),new Point(130,229),new Point(133,233),new Point(134,236),new Point(136,239),new Point(138,240),new Point(139,242),new Point(140,244),new Point(142,242),new Point(142,240),new Point(142,237),new Point(143,235),new Point(143,233),new Point(145,229),new Point(146,226),new Point(148,217),new Point(149,208),new Point(149,205),new Point(151,196),new Point(151,193),new Point(153,182),new Point(155,172),new Point(157,165),new Point(159,160),new Point(162,155),new Point(164,150),new Point(165,148),new Point(166,146)));
	this.Unistrokes[11] = new Unistroke("Whatever delete", new Array(new Point(123,129),new Point(123,131),new Point(124,133),new Point(125,136),new Point(127,140),new Point(129,142),new Point(133,148),new Point(137,154),new Point(143,158),new Point(145,161),new Point(148,164),new Point(153,170),new Point(158,176),new Point(160,178),new Point(164,183),new Point(168,188),new Point(171,191),new Point(175,196),new Point(178,200),new Point(180,202),new Point(181,205),new Point(184,208),new Point(186,210),new Point(187,213),new Point(188,215),new Point(186,212),new Point(183,211),new Point(177,208),new Point(169,206),new Point(162,205),new Point(154,207),new Point(145,209),new Point(137,210),new Point(129,214),new Point(122,217),new Point(118,218),new Point(111,221),new Point(109,222),new Point(110,219),new Point(112,217),new Point(118,209),new Point(120,207),new Point(128,196),new Point(135,187),new Point(138,183),new Point(148,167),new Point(157,153),new Point(163,145),new Point(165,142),new Point(172,133),new Point(177,127),new Point(179,127),new Point(180,125)));
	this.Unistrokes[12] = new Unistroke("left curly brace", new Array(new Point(150,116),new Point(147,117),new Point(145,116),new Point(142,116),new Point(139,117),new Point(136,117),new Point(133,118),new Point(129,121),new Point(126,122),new Point(123,123),new Point(120,125),new Point(118,127),new Point(115,128),new Point(113,129),new Point(112,131),new Point(113,134),new Point(115,134),new Point(117,135),new Point(120,135),new Point(123,137),new Point(126,138),new Point(129,140),new Point(135,143),new Point(137,144),new Point(139,147),new Point(141,149),new Point(140,152),new Point(139,155),new Point(134,159),new Point(131,161),new Point(124,166),new Point(121,166),new Point(117,166),new Point(114,167),new Point(112,166),new Point(114,164),new Point(116,163),new Point(118,163),new Point(120,162),new Point(122,163),new Point(125,164),new Point(127,165),new Point(129,166),new Point(130,168),new Point(129,171),new Point(127,175),new Point(125,179),new Point(123,184),new Point(121,190),new Point(120,194),new Point(119,199),new Point(120,202),new Point(123,207),new Point(127,211),new Point(133,215),new Point(142,219),new Point(148,220),new Point(151,221)));
	this.Unistrokes[13] = new Unistroke("right curly brace", new Array(new Point(117,132),new Point(115,132),new Point(115,129),new Point(117,129),new Point(119,128),new Point(122,127),new Point(125,127),new Point(127,127),new Point(130,127),new Point(133,129),new Point(136,129),new Point(138,130),new Point(140,131),new Point(143,134),new Point(144,136),new Point(145,139),new Point(145,142),new Point(145,145),new Point(145,147),new Point(145,149),new Point(144,152),new Point(142,157),new Point(141,160),new Point(139,163),new Point(137,166),new Point(135,167),new Point(133,169),new Point(131,172),new Point(128,173),new Point(126,176),new Point(125,178),new Point(125,180),new Point(125,182),new Point(126,184),new Point(128,187),new Point(130,187),new Point(132,188),new Point(135,189),new Point(140,189),new Point(145,189),new Point(150,187),new Point(155,186),new Point(157,185),new Point(159,184),new Point(156,185),new Point(154,185),new Point(149,185),new Point(145,187),new Point(141,188),new Point(136,191),new Point(134,191),new Point(131,192),new Point(129,193),new Point(129,195),new Point(129,197),new Point(131,200),new Point(133,202),new Point(136,206),new Point(139,211),new Point(142,215),new Point(145,220),new Point(147,225),new Point(148,231),new Point(147,239),new Point(144,244),new Point(139,248),new Point(134,250),new Point(126,253),new Point(119,253),new Point(115,253)));
	this.Unistrokes[14] = new Unistroke("size", new Array(new Point(75,250),new Point(75,247),new Point(77,244),new Point(78,242),new Point(79,239),new Point(80,237),new Point(82,234),new Point(82,232),new Point(84,229),new Point(85,225),new Point(87,222),new Point(88,219),new Point(89,216),new Point(91,212),new Point(92,208),new Point(94,204),new Point(95,201),new Point(96,196),new Point(97,194),new Point(98,191),new Point(100,185),new Point(102,178),new Point(104,173),new Point(104,171),new Point(105,164),new Point(106,158),new Point(107,156),new Point(107,152),new Point(108,145),new Point(109,141),new Point(110,139),new Point(112,133),new Point(113,131),new Point(116,127),new Point(117,125),new Point(119,122),new Point(121,121),new Point(123,120),new Point(125,122),new Point(125,125),new Point(127,130),new Point(128,133),new Point(131,143),new Point(136,153),new Point(140,163),new Point(144,172),new Point(145,175),new Point(151,189),new Point(156,201),new Point(161,213),new Point(166,225),new Point(169,233),new Point(171,236),new Point(174,243),new Point(177,247),new Point(178,249),new Point(179,251),new Point(180,253),new Point(180,255),new Point(179,257),new Point(177,257),new Point(174,255),new Point(169,250),new Point(164,247),new Point(160,245),new Point(149,238),new Point(138,230),new Point(127,221),new Point(124,220),new Point(112,212),new Point(110,210),new Point(96,201),new Point(84,195),new Point(74,190),new Point(64,182),new Point(55,175),new Point(51,172),new Point(49,170),new Point(51,169),new Point(56,169),new Point(66,169),new Point(78,168),new Point(92,166),new Point(107,164),new Point(123,161),new Point(140,162),new Point(156,162),new Point(171,160),new Point(173,160),new Point(186,160),new Point(195,160),new Point(198,161),new Point(203,163),new Point(208,163),new Point(206,164),new Point(200,167),new Point(187,172),new Point(174,179),new Point(172,181),new Point(153,192),new Point(137,201),new Point(123,211),new Point(112,220),new Point(99,229),new Point(90,237),new Point(80,244),new Point(73,250),new Point(69,254),new Point(69,252)));
	this.Unistrokes[15] = new Unistroke("pigtail", new Array(new Point(81,219),new Point(84,218),new Point(86,220),new Point(88,220),new Point(90,220),new Point(92,219),new Point(95,220),new Point(97,219),new Point(99,220),new Point(102,218),new Point(105,217),new Point(107,216),new Point(110,216),new Point(113,214),new Point(116,212),new Point(118,210),new Point(121,208),new Point(124,205),new Point(126,202),new Point(129,199),new Point(132,196),new Point(136,191),new Point(139,187),new Point(142,182),new Point(144,179),new Point(146,174),new Point(148,170),new Point(149,168),new Point(151,162),new Point(152,160),new Point(152,157),new Point(152,155),new Point(152,151),new Point(152,149),new Point(152,146),new Point(149,142),new Point(148,139),new Point(145,137),new Point(141,135),new Point(139,135),new Point(134,136),new Point(130,140),new Point(128,142),new Point(126,145),new Point(122,150),new Point(119,158),new Point(117,163),new Point(115,170),new Point(114,175),new Point(117,184),new Point(120,190),new Point(125,199),new Point(129,203),new Point(133,208),new Point(138,213),new Point(145,215),new Point(155,218),new Point(164,219),new Point(166,219),new Point(177,219),new Point(182,218),new Point(192,216),new Point(196,213),new Point(199,212),new Point(201,211)));
	this.Unistrokes[16] = new Unistroke("play", new Array(new Point(-137.0290248072543, 0),new Point(-126.95211888593913, 4.338275343490579),new Point(-116.87521296462396, 8.676550686981102),new Point(-106.79830704330881, 13.014826030471738),new Point(-96.72140112199365, 17.35310137396226),new Point(-86.6444952006785, 21.69137671745284),new Point(-76.56758927936335, 26.02965206094342),new Point(-66.49068335804819, 30.367927404433942),new Point(-56.413777436733035, 34.70620274792452),new Point(-46.33687151541787, 39.044478091415044),new Point(-36.259965594102724, 43.382753434905624),new Point(-26.18305967278758, 47.7210287783962),new Point(-16.180870196961777, 52.350133585062736),new Point(-6.442880206072516, 58.007619678769856),new Point(3.094336003184239, 64.25617220608945),new Point(12.41491076273499, 71.14753807942333),new Point(22.02999620987677, 77.20374629187336),new Point(31.724964868019327, 83.00247043862959),new Point(41.77260475741309, 87.45382458739829),new Point(51.84951067872825, 91.79209993088887),new Point(62.11383143050301, 94.83907536712269),new Point(72.49358900753833, 97.40039177716466),new Point(82.67948554500495, 101.13613343896714),new Point(92.75639146632014, 105.47440878245772),new Point(102.83329738763533, 109.81268412594835),new Point(112.9709751927457, 112.86752855575361),new Point(111.96552365331186, 102.61048605534296),new Point(107.7710349991275, 89.0789317189313),new Point(103.81660905051933, 75.39228880326795),new Point(98.88032793760803, 62.33995733592877),new Point(95.19206418578537, 48.54421174729271),new Point(91.9101736962514, 34.506399316381874),new Point(87.57417356930765, 21.04276049499549),new Point(83.1652530353127, 7.629789611957847),new Point(77.91090121381811, -5.176410317669337),new Point(72.53024667633017, -17.87581178022009),new Point(66.89410702242313, -30.359181318359504),new Point(61.38195766872764, -42.95029349182744),new Point(56.3098439132782, -55.89447733033825),new Point(51.37356280036684, -68.94680879767742),new Point(46.43728168745548, -81.99914026501662),new Point(42.07554978222086, -95.42264983815474),new Point(37.72672493570917, -108.81203104524823),new Point(32.83432939192025, -120.86647360796525),new Point(29.710810311890242, -134.97127865418616),new Point(22.43949385478436, -137.13247144424642),new Point(14.15708831043726, -128.07253169337585),new Point(5.099612043033829, -120.51682600117755),new Point(-3.5308049346341477, -112.03421446523402),new Point(-12.13384823375742, -103.4995279325243),new Point(-20.47432240143317, -94.4653364959085),new Point(-28.78817766154323, -85.38350273484025),new Point(-37.04822809109383, -76.20536948483547),new Point(-45.019826316618804, -66.54867893256173),new Point(-52.92539359218827, -56.78085952849693),new Point(-61.09104157901127, -47.43832817777772),new Point(-70.11659010059131, -39.81137639304421),new Point(-79.61804275414622, -33.441031706587125),new Point(-88.98185807799155, -26.66382143618054),new Point(-98.18593528053735, -19.8288244311874),new Point(-107.86017144815334, -14.358368729308154),new Point(-116.9426264040087, -6.901812054820056),new Point(-126.81031361405843, -2.9603268040981447),new Point(-134.4671252762691, 1.102940292839662)));
	this.Unistrokes[17] = new Unistroke("mute", new Array(new Point(-140.3745363742012, 2.842170943040401e-14),new Point(-133.06586813406227, -6.133759707148357),new Point(-125.75719989392331, -12.267519414296714),new Point(-118.4485316537844, -18.40127912144507),new Point(-111.13986341364547, -24.53503882859343),new Point(-103.83119517350656, -30.668798535741814),new Point(-96.52252693336763, -36.80255824289017),new Point(-89.21385869322873, -42.93631795003853),new Point(-81.90519045308977, -49.070077657186886),new Point(-74.59652221295087, -55.20383736433524),new Point(-67.28785397281194, -61.3375970714836),new Point(-59.979185732673045, -67.47135677863196),new Point(-52.67335104121133, -73.60794900369396),new Point(-46.03477488963307, -80.41155703915535),new Point(-38.86101730150634, -86.68017832169718),new Point(-31.552349061367437, -92.81393802884554),new Point(-24.24368082122851, -98.9476977359939),new Point(-16.93501258108961, -105.08145744314226),new Point(-14.477382955996916, -106.15376986339746),new Point(-13.726717534884756, -96.84981244812451),new Point(-13.185419940415926, -87.52987472024917),new Point(-13.014815245146536, -78.24169383217696),new Point(-14.28678591065875, -68.99494432878438),new Point(-14.699854683083686, -59.67562898511338),new Point(-14.485320509534176, -50.34229057479541),new Point(-14.632439919620225, -41.01703289822632),new Point(-15.895887482114688, -31.77520007647027),new Point(-15.6842036080009, -22.490135950418477),new Point(-15.153692745605213, -13.169597731224826),new Point(-13.73322566937199, -3.9467164930209435),new Point(-13.815996000430033, 5.35010890209108),new Point(-13.02378550001086, 12.274636533497386),new Point(-3.534850312075946, 10.39124647820833),new Point(5.936298983539643, 8.677965654300777),new Point(15.62705016835909, 8.72320057396314),new Point(25.299200387223095, 9.362465941420425),new Point(34.96864599144297, 8.925092720398425),new Point(44.61998860354183, 8.053716088238588),new Point(54.26623573520604, 7.134694007320604),new Point(63.94603905042598, 6.613799150681643),new Point(73.60229772074277, 5.796033385648002),new Point(83.2856500043545, 5.513121557183439),new Point(92.97891037190058, 5.352691080247467),new Point(102.65703092829236, 5.744191218042488),new Point(109.6254636257988, 7.074002781023523),new Point(102.37613316520319, 13.263318399371059),new Point(96.21409881363232, 20.47063176797343),new Point(90.19691808226284, 27.789057301129787),new Point(83.76597373787538, 34.71849611485314),new Point(77.44454709358362, 41.71776917074138),new Point(71.36965232030812, 48.81031628338829),new Point(65.36171103082464, 56.12863785914661),new Point(59.70327788777993, 63.70822717639558),new Point(53.87034783393992, 71.15588790117616),new Point(48.88929329054784, 79.11551981352082),new Point(42.293101160624104, 85.86503733228759),new Point(35.848218548506594, 92.83724463706372),new Point(30.09539867182403, 100.35165845704998),new Point(23.743156812190506, 107.37503469030358),new Point(16.977542637618996, 114.01723714126919),new Point(11.47351570984165, 121.6886758432041),new Point(4.9738503347554115, 128.41921724364497),new Point(-0.0831282051347273, 136.292452804936),new Point(-5.553524142781868, 143.84623013660254)));
	this.Unistrokes[18] = new Unistroke("add", new Array(new Point(-144.03167097443912, 8.526512829121202e-14),new Point(-132.9435730192437, -9.208859032894338),new Point(-121.85547506404822, -18.417718065788705),new Point(-110.76737710885277, -27.626577098683157),new Point(-99.67927915365733, -36.835436131577524),new Point(-88.53825134425873, -45.974040043983706),new Point(-76.7972485344332, -54.28650470154372),new Point(-64.27313567160236, -61.33606398314106),new Point(-51.38977347225118, -67.67997418285381),new Point(-37.90152662602604, -72.56038428021918),new Point(-24.464510640688275, -77.57746749269754),new Point(-11.276053271714602, -83.23729694346373),new Point(2.4149580233052745, -87.30481208184918),new Point(16.055174382268802, -91.6616887178145),new Point(29.693188450982177, -96.03703911381275),new Point(43.16234676905461, -100.95570989144859),new Point(57.00647023459135, -104.62347966640311),new Point(70.97698974952394, -107.52862465725313),new Point(84.94431261178784, -104.35329422607556),new Point(97.71015725603226, -98.10363705496562),new Point(105.9683290255609, -86.62388356146322),new Point(103.62314893441234, -72.29176382267357),new Point(98.54942225442821, -58.712189222328675),new Point(92.30423751867096, -45.61347477194187),new Point(85.6803025785535, -32.708032274269215),new Point(78.66068858308765, -20.02450771043968),new Point(71.48211683744753, -7.429633653100069),new Point(64.45668556348, 5.25439845855027),new Point(56.88467125015583, 17.599249270666974),new Point(48.91786660105939, 29.694160879630942),new Point(40.876816991541205, 41.73837949400712),new Point(32.880177018376145, 53.8120690961961),new Point(25.09544483123301, 66.02920609872385),new Point(17.74340796418676, 78.51015428187029),new Point(10.848492857672113, 91.2677414270672),new Point(4.096697323956988, 104.10449702958348),new Point(-1.847339665804185, 117.32945034519653),new Point(-9.45891640959556, 129.56803559026886),new Point(-18.472639786270832, 140.8690514319707),new Point(-28.464049591865518, 142.47137534274688),new Point(-35.38144498907275, 129.8580654535165),new Point(-38.46586732985665, 115.66915252342918),new Point(-42.48716900280802, 101.70736556138215),new Point(-45.62903925233387, 87.50499554059448),new Point(-48.77090950185975, 73.30262551980687),new Point(-51.912779751385585, 59.1002554990192),new Point(-53.07475613595703, 44.59299954765427),new Point(-54.11180651639211, 30.078376683331044),new Point(-53.89718854195242, 15.522780872683626),new Point(-53.82577508429334, 0.9662818301826519),new Point(-53.89763702523901, -13.590675236369805),new Point(-53.75420503024627, -28.108497574798662),new Point(-45.497631770084496, -37.48720884346292),new Point(-32.57949519870698, -31.21482402043418),new Point(-19.691145815027426, -24.876299936684575),new Point(-6.807253778950326, -18.528360770821706),new Point(5.214401696230482, -10.624259256093524),new Point(17.192690667433453, -2.6519979903703472),new Point(29.033709071153396, 5.530580191750147),new Point(40.87472747487337, 13.71315837387067),new Point(52.57403302534115, 22.103302855564323),new Point(64.24203111423711, 30.53854944886055),new Point(75.71764417650166, 39.24275345821414),new Point(87.06358422177917, 48.11520390538138)));
	this.Unistrokes[19] = new Unistroke("delete", new Array(new Point(-131.744300558986, -8.526512829121202e-14),new Point(-117.79205839820442, 5.966643995983446),new Point(-103.83981623742282, 11.933287991966921),new Point(-89.88757407664126, 17.899931987950424),new Point(-75.93533191585969, 23.8665759839339),new Point(-61.98308975507811, 29.833219979917402),new Point(-48.03084759429653, 35.799863975900905),new Point(-34.078605433514966, 41.76650797188441),new Point(-20.126363272733386, 47.73315196786791),new Point(-6.174121111951791, 53.699795963851386),new Point(7.7781210488297745, 59.66643995983486),new Point(21.24890915425067, 66.76456389693419),new Point(34.673287308399125, 73.99499342981045),new Point(48.39324261479038, 80.5396107304993),new Point(62.345484775571975, 86.50625472648284),new Point(76.29772693635354, 92.47289872246625),new Point(74.50856416026164, 92.33332074914142),new Point(60.0579523864682, 87.97569979610819),new Point(45.86878662582194, 82.69820019010439),new Point(31.836804738778, 76.96349672281292),new Point(18.388220309503055, 69.85514663728748),new Point(5.255585143034352, 62.0195700581541),new Point(-8.081927498966365, 54.60919598766765),new Point(-21.432302901593005, 47.2225238962655),new Point(-34.94083415947162, 40.2297084422367),new Point(-48.85567075413299, 34.1683795965088),new Point(-62.514118820271506, 27.45805350739286),new Point(-75.98474218700431, 20.341237550954162),new Point(-89.91883210712356, 14.330680318521189),new Point(-103.29801936831691, 7.000909329037086),new Point(-117.0015081789937, 0.46437388821212267),new Point(-124.37378306876148, -9.590046045452226),new Point(-123.07893912523012, -25.600044898188884),new Point(-118.80362043014472, -41.057633167074954),new Point(-114.22573532112787, -56.44338615274714),new Point(-108.29825692615276, -71.27473923785928),new Point(-98.68078947921128, -83.5985446483442),new Point(-87.05077251733624, -93.7450493998617),new Point(-74.76535936020878, -103.02134900069396),new Point(-61.484448096121895, -110.49601199461243),new Point(-48.04704647504239, -117.65097851753791),new Point(-34.218252497591564, -123.69462864767954),new Point(-19.52500650201668, -126.86156089500084),new Point(-4.5757927684721835, -128.14136500167976),new Point(10.350988446857144, -126.58246149452303),new Point(24.764603144526916, -122.29657561181278),new Point(38.71684530530848, -116.3299316158293),new Point(52.29706847868505, -109.56383940853517),new Point(64.77723482130298, -100.65608430818733),new Point(75.63163742410416, -89.48219074664765),new Point(85.93440782926976, -77.71457339432604),new Point(92.04389543692685, -62.971366647292086),new Point(99.1212979653636, -48.707118455251276),new Point(104.12109151434223, -33.48115862145619),new Point(108.61336506821036, -18.04474824302855),new Point(112.66660345385984, -2.464380741853404),new Point(115.42415911429194, 13.384814796049),new Point(116.94201534871004, 29.48079683751996),new Point(117.598857394862, 45.646810002890874),new Point(118.255699441014, 61.81282316826173),new Point(116.56431335969282, 77.88189961010926),new Point(113.8940148646972, 93.78913645092621),new Point(110.33526794287988, 109.50061307570456),new Point(104.04181534101062, 121.85863499832021)));
	this.Unistrokes[20] = new Unistroke("volume", new Array(new Point(-113.32755866407288, -5.684341886080802e-14),new Point(-108.15121738123483, -13.077223753699826),new Point(-104.69724434045918, -26.905839926085548),new Point(-98.8325998415318, -39.85511803693686),new Point(-93.21045122008714, -52.764144763494954),new Point(-85.20766530076682, -64.59979223871048),new Point(-77.20487938144652, -76.43543971392602),new Point(-66.43352698173248, -84.72430953331315),new Point(-54.01791554198782, -78.90937546331818),new Point(-51.40834943066176, -66.38033634202343),new Point(-55.2834235941866, -52.969372102761554),new Point(-63.28620951350692, -41.133724627546),new Point(-71.638696289986, -29.604340824179616),new Point(-81.60571123233416, -19.45966590591999),new Point(-92.57521056752839, -10.41489012419288),new Point(-104.15732668442756, -3.6998890928747414),new Point(-95.48344240327374, 6.586589387371703),new Point(-86.78000254708773, 17.795326707869407),new Point(-77.7277878242811, 28.639851579514186),new Point(-68.56722664972429, 39.48215171333399),new Point(-60.95380266651634, 51.52302331826485),new Point(-53.2209768689041, 63.40367043968919),new Point(-45.923356760865346, 75.53298779436827),new Point(-37.42919972689714, 86.89383023078702),new Point(-28.757805261841426, 98.24644553753453),new Point(-20.620930336591755, 109.92835934985223),new Point(-13.630262098977397, 122.39113464179368),new Point(-6.81005643674672, 134.91144685456592),new Point(-0.17575953013380285, 147.5204235431713),new Point(7.602795197344278, 159.48123915977314),new Point(15.280505751535742, 153.33452289712935),new Point(22.024887813393775, 140.8531640618543),new Point(27.127515228870465, 127.50294433778535),new Point(32.1658992310916, 114.13915152200494),new Point(37.55098905426672, 100.91023376694241),new Point(42.6016896658042, 87.53999694193968),new Point(47.298757703068276, 74.14948344060073),new Point(54.006604973635234, 61.542713128123665),new Point(62.00939089295554, 49.70706565290814),new Point(69.22199410857536, 37.39632801660295),new Point(76.4120748597912, 25.11889977425713),new Point(80.73736711863774, 13.296903499032766),new Point(86.37531174587238, 0.19148476301594997),new Point(93.34394161782004, -12.25632519997788),new Point(100.95279212021217, -24.325160389429954),new Point(108.9555780395325, -36.16080786464548),new Point(116.95836395885283, -47.996455339861),new Point(124.96114987817316, -59.832102815076524),new Point(132.96393579749338, -71.66775029029203),new Point(136.6724413359271, -80.66813928568892),new Point(122.95541178933689, -78.14572965043106),new Point(108.88973014280958, -77.97516220516238),new Point(94.76193258104038, -76.28082348249445),new Point(80.57250737753284, -76.51717531950888),new Point(66.37805370853073, -75.10249175709016),new Point(52.13120002153164, -75.66948897533364),new Point(37.926799460528855, -76.88608603238795),new Point(23.903065716823704, -79.49994494889611),new Point(9.860222415877729, -81.41736492178109),new Point(-4.216971543908585, -83.66413029111146),new Point(-18.01596830871094, -86.95013238321278),new Point(-31.750151934667258, -90.51876084022679),new Point(-44.97692986896794, -88.25575630685321),new Point(-56.52429257282151, -87.29612131164262)));
	this.Unistrokes[21] = new Unistroke("volume2", new Array(new Point(-107.34010198742361, -5.684341886080802e-14),new Point(-100.55942328718596, 12.547423102668972),new Point(-94.34583749615862, 25.306163601581005),new Point(-88.13949388475464, 38.070034782638174),new Point(-81.35020899923887, 50.61477725491514),new Point(-74.39992677757068, 63.09900052919582),new Point(-67.44964455590247, 75.58322380347653),new Point(-58.19273950987707, 86.7570745999893),new Point(-45.53930409919593, 95.06264332605386),new Point(-30.942544781696, 95.92587684190059),new Point(-29.54049396974682, 83.69947072449807),new Point(-34.3270855559316, 70.50599444168401),new Point(-38.23514850096001, 57.0898055631485),new Point(-44.37428025706774, 44.30332105167088),new Point(-51.32456247873594, 31.819097777390226),new Point(-58.274844700404145, 19.33487450310949),new Point(-66.70959258661348, 7.554371345995747),new Point(-75.21694243369384, -4.110335668220813),new Point(-89.87382591609979, -8.010037253246168),new Point(-105.66309613748324, -7.319772793186189),new Point(-100.99646627564317, -15.195586131373943),new Point(-93.98962106683943, -27.653459094010458),new Point(-87.99038509018756, -40.47180897636545),new Point(-81.10259811027704, -52.953940362832085),new Point(-73.77591420881858, -65.27585438370411),new Point(-66.64362196119406, -77.68312373561493),new Point(-57.92250276546437, -89.27901696599),new Point(-49.224064368215664, -100.91125559353515),new Point(-39.39217065703636, -111.82105794272218),new Point(-30.089261784579747, -123.03167659815787),new Point(-19.948894870670784, -133.75302645858594),new Point(-9.304449590203802, -144.1027005337628),new Point(1.6157721013371997, -154.0741231580994),new Point(10.683282841094979, -151.64570858655898),new Point(17.633565062763182, -139.1614853122783),new Point(24.583847284431414, -126.67726203799762),new Point(31.534129506099617, -114.19303876371694),new Point(38.48441172776782, -101.70881548943625),new Point(45.43469394943605, -89.22459221515557),new Point(52.384976171104256, -76.74036894087484),new Point(59.33525839277246, -64.25614566659415),new Point(66.28554061444069, -51.77192239231347),new Point(73.23582283610887, -39.28769911803275),new Point(80.18610505777713, -26.80347584375204),new Point(87.13638727944533, -14.31925256947136),new Point(94.08666950111353, -1.8350292951906795),new Point(101.03695172278174, 10.649193979090057),new Point(107.98723394445, 23.133417253370737),new Point(114.93751616611814, 35.617640527651446),new Point(121.8877983877864, 48.101863801932126),new Point(128.8380806094546, 60.58608707621286),new Point(135.78836283112287, 73.07031035049351),new Point(142.65989801257638, 83.29712188666142),new Point(126.70720517630343, 83.51580679772874),new Point(110.74266560971944, 84.3288559952729),new Point(94.74487712840443, 84.30425753421619),new Point(78.7564908929931, 85.2445422102613),new Point(62.82531590811706, 86.68171760666482),new Point(46.96446103558685, 88.66930411678439),new Point(30.99089491490966, 89.74201408452072),new Point(14.971456013207273, 90.04793108480797),new Point(-1.0535874137567305, 89.83884068355653),new Point(-17.057974431430125, 89.35540036354692),new Point(-32.1690601691692, 89.81411327808755)));
	this.Unistrokes[22] = new Unistroke("seek", new Array(new Point(-129.41322461579853, 5.684341886080802e-14),new Point(-127.77640896343827, -12.29434445081273),new Point(-126.139593311078, -24.58868890162546),new Point(-124.50277765871775, -36.88303335243825),new Point(-120.86647049326037, -46.56286504281735),new Point(-117.1595853242633, -56.25226783855044),new Point(-113.2438538590124, -65.18613182536438),new Point(-108.39025213007116, -71.84832248030722),new Point(-103.64903652759068, -78.89721276225015),new Point(-99.01919631698868, -86.32932492266451),new Point(-93.87629345737547, -91.70450985062223),new Point(-88.66869638705447, -96.82032823914551),new Point(-83.47932545165342, -102.0289113654718),new Point(-78.30993469670337, -107.33918671611963),new Point(-72.6959987021068, -109.15736316922113),new Point(-67.07763830319438, -110.99792373443773),new Point(-61.482892186956775, -113.1854654513711),new Point(-55.846752683818664, -114.65502355381335),new Point(-50.19155336874772, -115.42362926577698),new Point(-44.53941612421829, -114.20520154590679),new Point(-39.04019611621017, -111.22427340096925),new Point(-33.60348762601019, -107.5228471669027),new Point(-28.171643096932314, -103.79171478099835),new Point(-22.979939534977504, -98.59394566574156),new Point(-18.49338352019278, -90.80701902946777),new Point(-14.128922003184073, -82.60450179351852),new Point(-10.386112984855998, -72.94970909766533),new Point(-7.659772160399768, -61.828142687426975),new Point(-4.89701953781676, -50.71414633994391),new Point(-1.6185131364491667, -40.28937113318665),new Point(0.7700681151579829, -28.641369781532205),new Point(3.3001469122534672, -17.15333148921286),new Point(5.987076905672126, -5.8426135676295985),new Point(8.89368073439661, 5.179542754458282),new Point(11.85270688454625, 16.13283758059862),new Point(14.53963687796491, 27.443555502181823),new Point(17.28050803787204, 38.68341678642861),new Point(20.294197494201, 49.56490637894683),new Point(23.092196850257665, 60.72972457199319),new Point(26.019245254236665, 71.6755709463796),new Point(29.634918190187875, 81.57501901323087),new Point(33.21960136677606, 91.53047205349407),new Point(36.69225326521658, 101.68838903290754),new Point(40.64929334521153, 110.89583738178459),new Point(44.97624785362919, 119.12426805092724),new Point(49.70530577265072, 126.22473606411842),new Point(54.8883802609534, 131.17155986398842),new Point(60.336924411797526, 134.57637073422308),new Point(65.97882127390298, 133.13553871868902),new Point(71.6207181360084, 131.69470670315496),new Point(77.0730490698642, 128.18187016684755),new Point(82.36050868471759, 123.51766039567934),new Point(87.36922726715187, 117.47529264175597),new Point(92.01584143624353, 110.11792540741914),new Point(96.1343581798107, 101.279866833261),new Point(99.62689674426696, 91.17143959369815),new Point(102.6858907613094, 80.37489124702131),new Point(105.46359686623109, 69.18100113436174),new Point(108.11794924263441, 57.8317181754673),new Point(110.62628362661914, 46.313162236152095),new Point(113.08919369600233, 34.74549757667472),new Point(115.19229482307213, 22.8521260763074),new Point(117.23409655406158, 11.003918289962314),new Point(120.58677538420147, 1.249898490797932)));
	this.Unistrokes[23] = new Unistroke("all2", new Array(new Point(-124.66420531963078, 0),new Point(-123.73096861535882, -12.034713104628622),new Point(-122.79773191108688, -24.069426209257273),new Point(-120.05345758767578, -35.81588753081081),new Point(-116.68066339497435, -47.354253143926144),new Point(-112.28183184802812, -58.583008403098944),new Point(-105.87843803068544, -68.63675963384227),new Point(-99.26569841789066, -78.54902376999334),new Point(-90.49501313215562, -86.71237357344472),new Point(-80.06534262995464, -92.9007552076902),new Point(-69.89858620296451, -99.47487747857055),new Point(-59.13828039576768, -105.1159832953373),new Point(-48.73754259777141, -111.36957979872851),new Point(-37.804154753389156, -116.64728599694921),new Point(-26.53235360672616, -121.2016028680756),new Point(-14.813643847114975, -124.44810484840902),new Point(-2.705979983386186, -125.39380614785986),new Point(9.451693767898064, -125.81289969532948),new Point(21.587332212161385, -124.88742420047153),new Point(33.34743011602538, -122.189047858041),new Point(43.95515370710453, -116.646644087408),new Point(53.79137641993157, -109.57230348165669),new Point(63.62855323320011, -102.50962769090079),new Point(72.51139333943271, -94.28498641284361),new Point(80.65627171912524, -85.32714542280667),new Point(87.91180562143273, -75.64513937938355),new Point(94.18817049398666, -65.3088093207781),new Point(100.00133851779015, -54.71411124746385),new Point(105.19142893547246, -43.821639576906364),new Point(111.01452399496083, -33.23168571056863),new Point(115.51332297063544, -22.020194303334108),new Point(119.33133419158577, -10.562744322209653),new Point(123.20832545408626, 0.858501186570436),new Point(125.33579468036925, 12.69770242147814),new Point(125.06726279754253, 24.753133355269398),new Point(124.13402609327062, 36.78784645989808),new Point(120.25775836774318, 48.15150528551928),new Point(112.9758811496518, 57.70343015785127),new Point(106.15012840249074, 67.67660320962173),new Point(98.34163741707016, 76.88270425522862),new Point(89.65121112527919, 85.3283032659451),new Point(81.5349451665382, 94.30706802245751),new Point(72.62886957478469, 102.48988955158265),new Point(62.13808038653141, 108.60956155356288),new Point(51.271716716938926, 113.966671977),new Point(39.5308180920637, 117.01601190096855),new Point(27.81912504183731, 120.24248476067649),new Point(15.886027035026444, 122.56997833984641),new Point(3.7674636387322664, 123.65817018581637),new Point(-8.381581888452331, 124.18710030467051),new Point(-20.4068306280046, 122.52583636833745),new Point(-31.921348383915927, 118.87160224319624),new Point(-42.704628663138635, 113.30440519628215),new Point(-52.976468171989865, 106.83439122342392),new Point(-62.90449037822249, 99.87469789193332),new Point(-71.26431619435411, 91.2430162853166),new Point(-80.33785182440563, 83.25034168479047),new Point(-88.29925524861487, 74.27855840758727),new Point(-96.05589021817845, 65.05044037792831),new Point(-104.01158035198368, 55.94069039734924),new Point(-110.88286040340384, 46.02327354764722),new Point(-119.25376960226406, 37.49093583852246),new Point(-122.7968325405871, 26.903437828270455),new Point(-124.03860360862433, 15.36355023618006)));
	this.Unistrokes[24] = new Unistroke("four", new Array(new Point(-125.34233327435615, -2.842170943040401e-14),new Point(-116.47860663682644, 10.947491057996302),new Point(-107.61487999929668, 21.894982115992576),new Point(-98.75115336176694, 32.84247317398885),new Point(-89.88742672423722, 43.789964231985124),new Point(-81.02370008670748, 54.737455289981455),new Point(-72.15997344917774, 65.68494634797773),new Point(-63.296246811648004, 76.632437405974),new Point(-53.7264301354184, 85.33064998132838),new Point(-44.422951540191576, 95.10383565116896),new Point(-35.55922490266184, 106.05132670916524),new Point(-26.695498265132102, 116.99881776716157),new Point(-18.30241146884964, 128.88869253028722),new Point(-10.797993521294927, 138.8661252715058),new Point(-5.620711020991109, 122.65146566063126),new Point(-1.0833394159440672, 105.75369442697243),new Point(4.356024979961035, 89.67824873695312),new Point(10.399170806579093, 74.17995555405187),new Point(16.46076743644099, 58.70229704836501),new Point(22.548300884612246, 43.2538856496748),new Point(28.65961676450229, 27.83229200930876),new Point(35.04631735510026, 12.736749943712681),new Point(41.51706939913723, -2.2592763982797806),new Point(47.98782144317423, -17.255302740272214),new Point(54.458573487211254, -32.251329082264675),new Point(60.92932553124825, -47.24735542425711),new Point(67.40007757528522, -62.24338176624951),new Point(73.06085396323545, -77.57170115505684),new Point(65.1437199681022, -83.93381554366965),new Point(54.27168242716553, -86.46315160192472),new Point(43.48920754943208, -89.9170973427511),new Point(32.68791372161644, -93.1953918494174),new Point(21.86614731621711, -96.28069866630321),new Point(11.044380910817779, -99.3660054831889),new Point(0.11534585832995958, -101.04746257060594),new Point(-10.785719647601013, -103.11993304304991),new Point(-21.63506600561621, -105.91427324943615),new Point(-32.519758021928496, -108.1848563287318),new Point(-43.46218605000553, -109.5998987530078),new Point(-54.418821512295, -110.61102930931202),new Point(-65.388158857822, -111.13387472849422),new Point(-76.28207247296169, -109.65595232057015),new Point(-70.76039212078601, -100.33153673424312),new Point(-61.89666548325627, -89.38404567624681),new Point(-53.032938845726534, -78.43655461825051),new Point(-44.169212208196825, -67.48906356025424),new Point(-35.30548557066706, -56.541572502257935),new Point(-26.223927779043237, -46.121153495728436),new Point(-17.103682690511533, -35.794343656499706),new Point(-7.98343760197983, -25.46753381727109),new Point(1.252682779183374, -15.449510548157463),new Point(10.656745239191878, -5.879022360310358),new Point(20.060807699200353, 3.691465827536689),new Point(29.464870159208857, 13.261954015383793),new Point(38.95132995571231, 22.59198657210331),new Point(48.53318450867454, 31.643633839366743),new Point(58.115039061636736, 40.69528110663023),new Point(67.6642326932066, 49.84465928973671),new Point(77.18832144991563, 59.069158513759334),new Point(86.7124102066247, 68.29365773778196),new Point(96.20276886998394, 77.6160482700898),new Point(105.64005473787108, 87.09246640407812),new Point(115.18797401867806, 96.24541107554958),new Point(124.65766672564382, 105.5426151098658)));
	this.Unistrokes[25] = new Unistroke("question", new Array(new Point(-107.68520594605934, 2.842170943040401e-14),new Point(-111.38442645847823, -13.494312632403194),new Point(-111.93366629446011, -27.241180699399507),new Point(-108.55893989493202, -40.771650272664175),new Point(-103.10137587562647, -53.68015761329198),new Point(-96.40707692629915, -65.60405149919274),new Point(-88.32898449661774, -77.28461501926066),new Point(-79.45407969947031, -88.5675203903424),new Point(-67.94731920474862, -97.29128164369965),new Point(-54.74723536787491, -104.43457553549887),new Point(-41.32175242102622, -111.19065796939964),new Point(-27.17429921272128, -116.67514188840818),new Point(-12.273447265477785, -120.14944650532628),new Point(2.6759452291940136, -123.48860815410708),new Point(17.62533772386581, -126.82776980288786),new Point(32.91790944430872, -125.3014858404593),new Point(47.70774173461086, -121.62823986768372),new Point(62.18835828605029, -116.93090898353263),new Point(76.68612928978422, -112.32983744029679),new Point(90.54432803739707, -106.26847927646016),new Point(104.52377991759118, -100.44879440926906),new Point(116.4572520784738, -91.72168726593303),new Point(124.8107461805688, -80.15652362820515),new Point(130.634515358447, -67.31178227937335),new Point(134.74315505926933, -53.92540227210199),new Point(137.75597800423589, -40.31808789476537),new Point(138.06633370553993, -26.565375818773333),new Point(135.00016889599374, -12.943310026576768),new Point(130.15699941726467, 0.1814138479916778),new Point(124.24920531158216, 13.01777299288895),new Point(116.4900045736673, 25.000363333204433),new Point(107.38781550474943, 36.213445943423466),new Point(98.25257663134892, 47.3737076044369),new Point(87.40322953637224, 57.21286807263431),new Point(74.9443509291014, 65.28314935926596),new Point(62.152676831042015, 73.00843338179288),new Point(49.19447311080938, 79.64788300533945),new Point(34.245080616137614, 82.98704465412027),new Point(19.247563686651404, 86.07558947381301),new Point(3.903977804359755, 87.25754239418382),new Point(-11.400392793885231, 87.43383376754844),new Point(-26.664684110950162, 87.3818403289502),new Point(-41.88678241798664, 85.28406546056175),new Point(-56.9202912007095, 82.53840899556394),new Point(-69.40581962733731, 74.66306732277769),new Point(-79.24903153734454, 64.39827143869672),new Point(-86.41579210111097, 52.33045961453013),new Point(-87.59324379116016, 39.053090769126385),new Point(-80.12635008551001, 26.910725109669244),new Point(-70.56227283707312, 16.108432020277803),new Point(-58.412100851134966, 7.858069649142237),new Point(-43.73523947977682, 6.576591708018611),new Point(-31.12586383522668, 14.20620421810628),new Point(-22.230602438005292, 25.347023488671482),new Point(-18.531381925586402, 38.84133612107473),new Point(-17.738129357113507, 52.514800456716614),new Point(-23.703784242366908, 65.1486653292788),new Point(-29.084448482996095, 78.15754224434971),new Point(-37.07523394606096, 90.03984329319826),new Point(-45.896234206152684, 101.43318494466678),new Point(-56.622256244598674, 111.22910822294631),new Point(-70.64950387341833, 116.94920251464953),new Point(-84.87420583994098, 121.71567335058586),new Point(-99.74417860918042, 123.17223019711213)));
	// The $1 Gesture Recognizer API begins here -- 3 methods: Recognize(), AddGesture(), and DeleteUserGestures()
	//
	this.Recognize = function(points, useProtractor)
	{
		points = Resample(points, NumPoints);
		var radians = IndicativeAngle(points);
		points = RotateBy(points, -radians);
		points = ScaleTo(points, SquareSize);
		points = TranslateTo(points, Origin);
		var vector = Vectorize(points); // for Protractor

		var b = +Infinity;
		var u = -1;
		for (var i = 0; i < this.Unistrokes.length; i++) // for each unistroke
		{
			var d;
			if (useProtractor) // for Protractor
				d = OptimalCosineDistance(this.Unistrokes[i].Vector, vector);
			else // Golden Section Search (original $1)
				d = DistanceAtBestAngle(points, this.Unistrokes[i], -AngleRange, +AngleRange, AnglePrecision);
			if (d < b) {
				b = d; // best (least) distance
				u = i; // unistroke
			}
		}
		return (u == -1) ? new Result("No match.", 0.0) : new Result(this.Unistrokes[u].Name, useProtractor ? 1.0 / b : 1.0 - b / HalfDiagonal);
	};
	this.AddGesture = function(name, points)
	{
		this.Unistrokes[this.Unistrokes.length] = new Unistroke(name, points); // append new unistroke
		var num = 0;
		for (var i = 0; i < this.Unistrokes.length; i++) {
			if (this.Unistrokes[i].Name == name)
				num++;
		}
		return num;
	}
	this.DeleteUserGestures = function()
	{
		this.Unistrokes.length = NumUnistrokes; // clear any beyond the original set
		return NumUnistrokes;
	}
}
//
// Private helper functions from this point down
//
function Resample(points, n)
{
	var I = PathLength(points) / (n - 1); // interval length
	var D = 0.0;
	var newpoints = new Array(points[0]);
	for (var i = 1; i < points.length; i++)
	{
		var d = Distance(points[i - 1], points[i]);
		if ((D + d) >= I)
		{
			var qx = points[i - 1].X + ((I - D) / d) * (points[i].X - points[i - 1].X);
			var qy = points[i - 1].Y + ((I - D) / d) * (points[i].Y - points[i - 1].Y);
			var q = new Point(qx, qy);
			newpoints[newpoints.length] = q; // append new point 'q'
			points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i
			D = 0.0;
		}
		else D += d;
	}
	if (newpoints.length == n - 1) // somtimes we fall a rounding-error short of adding the last point, so add it if so
		newpoints[newpoints.length] = new Point(points[points.length - 1].X, points[points.length - 1].Y);
	return newpoints;
}
function IndicativeAngle(points)
{
	var c = Centroid(points);
	return Math.atan2(c.Y - points[0].Y, c.X - points[0].X);
}
function RotateBy(points, radians) // rotates points around centroid
{
	var c = Centroid(points);
	var cos = Math.cos(radians);
	var sin = Math.sin(radians);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = (points[i].X - c.X) * cos - (points[i].Y - c.Y) * sin + c.X
		var qy = (points[i].X - c.X) * sin + (points[i].Y - c.Y) * cos + c.Y;
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}
function ScaleTo(points, size) // non-uniform scale; assumes 2D gestures (i.e., no lines)
{
	var B = BoundingBox(points);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = points[i].X * (size / B.Width);
		var qy = points[i].Y * (size / B.Height);
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}
function TranslateTo(points, pt) // translates points' centroid
{
	var c = Centroid(points);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = points[i].X + pt.X - c.X;
		var qy = points[i].Y + pt.Y - c.Y;
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}
function Vectorize(points) // for Protractor
{
	var sum = 0.0;
	var vector = new Array();
	for (var i = 0; i < points.length; i++) {
		vector[vector.length] = points[i].X;
		vector[vector.length] = points[i].Y;
		sum += points[i].X * points[i].X + points[i].Y * points[i].Y;
	}
	var magnitude = Math.sqrt(sum);
	for (var i = 0; i < vector.length; i++)
		vector[i] /= magnitude;
	return vector;
}
function OptimalCosineDistance(v1, v2) // for Protractor
{
	var a = 0.0;
	var b = 0.0;
	for (var i = 0; i < v1.length; i += 2) {
		a += v1[i] * v2[i] + v1[i + 1] * v2[i + 1];
                b += v1[i] * v2[i + 1] - v1[i + 1] * v2[i];
	}
	var angle = Math.atan(b / a);
	return Math.acos(a * Math.cos(angle) + b * Math.sin(angle));
}
function DistanceAtBestAngle(points, T, a, b, threshold)
{
	var x1 = Phi * a + (1.0 - Phi) * b;
	var f1 = DistanceAtAngle(points, T, x1);
	var x2 = (1.0 - Phi) * a + Phi * b;
	var f2 = DistanceAtAngle(points, T, x2);
	while (Math.abs(b - a) > threshold)
	{
		if (f1 < f2) {
			b = x2;
			x2 = x1;
			f2 = f1;
			x1 = Phi * a + (1.0 - Phi) * b;
			f1 = DistanceAtAngle(points, T, x1);
		} else {
			a = x1;
			x1 = x2;
			f1 = f2;
			x2 = (1.0 - Phi) * a + Phi * b;
			f2 = DistanceAtAngle(points, T, x2);
		}
	}
	return Math.min(f1, f2);
}
function DistanceAtAngle(points, T, radians)
{
	var newpoints = RotateBy(points, radians);
	return PathDistance(newpoints, T.Points);
}
function Centroid(points)
{
	var x = 0.0, y = 0.0;
	for (var i = 0; i < points.length; i++) {
		x += points[i].X;
		y += points[i].Y;
	}
	x /= points.length;
	y /= points.length;
	return new Point(x, y);
}
function BoundingBox(points)
{
	var minX = +Infinity, maxX = -Infinity, minY = +Infinity, maxY = -Infinity;
	for (var i = 0; i < points.length; i++) {
		minX = Math.min(minX, points[i].X);
		minY = Math.min(minY, points[i].Y);
		maxX = Math.max(maxX, points[i].X);
		maxY = Math.max(maxY, points[i].Y);
	}
	return new Rectangle(minX, minY, maxX - minX, maxY - minY);
}
function PathDistance(pts1, pts2)
{
	var d = 0.0;
	for (var i = 0; i < pts1.length; i++) // assumes pts1.length == pts2.length
		d += Distance(pts1[i], pts2[i]);
	return d / pts1.length;
}
function PathLength(points)
{
	var d = 0.0;
	for (var i = 1; i < points.length; i++)
		d += Distance(points[i - 1], points[i]);
	return d;
}
function Distance(p1, p2)
{
	var dx = p2.X - p1.X;
	var dy = p2.Y - p1.Y;
	return Math.sqrt(dx * dx + dy * dy);
}
function Deg2Rad(d) { return (d * Math.PI / 180.0); }