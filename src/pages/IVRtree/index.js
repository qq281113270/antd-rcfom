/*
 * @Author: your name
 * @Date: 2021-06-16 17:24:20
 * @LastEditTime: 2021-06-23 17:41:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /antd-rcfom/src/pages/LogicFlow/index.js
 */
import React, { Component } from "react";
import "./index.less";
import { Icon, Input, Button, Checkbox, Drawer } from "antd";
import * as go from "gojs";
import LeftDrawer from "@/component/LeftDrawer";
// import icons from "./icons.js";
import cat from "@/image/cat.jpeg";
import "@/css/font-awesome-4.7.0/css/font-awesome.css";
import "@/css/font_ alibaba/iconfont.css";
import "@/css/font_ alibaba/iconfont.css";
import sms from "@/image/sms.jpg";
import modeltplate from "@/image/modeltplate.jpg";
import quan from "@/image/quan.jpg";
import "./index.less";

// function geoFunc(geoname) {
//   var geo = icons[geoname];
//   if (geo === undefined) geo = icons["heart"]; // use this for an unknown icon name
//   if (typeof geo === "string") {
//     geo = icons[geoname] = go.Geometry.parse(geo, true); // fill each geometry
//   }
//   console.log("geo=", geo);
//   return geo;
// }

class Index extends React.Component {
  componentDidMount() {
    let myDiagram = null;
    function init() {
      var $ = go.GraphObject.make; // for conciseness in defining templates
      myDiagram = $(go.Diagram, "myDiagramDiv", {
        allowCopy: false,
        "draggingTool.dragsTree": true,
        "commandHandler.deletesTree": true,
        layout: $(go.TreeLayout, {
          angle: 90,
          arrangement: go.TreeLayout.ArrangementFixedRoots,
        }),
        "undoManager.isEnabled": true,
      });

      // when the document is modified, add a "*" to the title and enable the "Save" button
      myDiagram.addDiagramListener("Modified", function (e) {
        var button = document.getElementById("SaveButton");
        if (button) button.disabled = !myDiagram.isModified;
        var idx = document.title.indexOf("*");
        if (myDiagram.isModified) {
          if (idx < 0) document.title += "*";
        } else {
          if (idx >= 0) document.title = document.title.substr(0, idx);
        }
      });

      var bluegrad = $(go.Brush, "Linear", { 0: "#C4ECFF", 1: "#70D4FF" });
      var greengrad = $(go.Brush, "Linear", { 0: "#B1E2A5", 1: "#7AE060" });

      // each action is represented by a shape and some text
      var actionTemplate = $(
        go.Panel,
        "Horizontal",
        $(
          go.Shape,
          { width: 12, height: 12 },
          new go.Binding("figure"),
          new go.Binding("fill")
        ),
        $(
          go.TextBlock,
          { font: "10pt Verdana, sans-serif" },
          new go.Binding("text")
        )
      );

      // each regular Node has body consisting of a title followed by a collapsible list of actions,
      // controlled by a PanelExpanderButton, with a TreeExpanderButton underneath the body
      myDiagram.nodeTemplate = $(
        // the default node template
        go.Node,
        "Vertical",
        new go.Binding("isTreeExpanded").makeTwoWay(), // remember the expansion state for
        new go.Binding("wasTreeExpanded").makeTwoWay(), //   when the model is re-loaded
        { selectionObjectName: "BODY" },
        // the main "BODY" consists of a RoundedRectangle surrounding nested Panels
        $(
          go.Panel,
          "Auto",
          { name: "BODY" },
          $(go.Shape, "Rectangle", { fill: bluegrad, stroke: null }),
          $(
            go.Panel,
            "Vertical",
            { margin: 3 },
            // the title
            $(
              go.TextBlock,
              {
                stretch: go.GraphObject.Horizontal,
                font: "bold 12pt Verdana, sans-serif",
              },
              new go.Binding("text", "question")
            ),
            // the optional list of actions
            $(
              go.Panel,
              "Vertical",
              { stretch: go.GraphObject.Horizontal, visible: false }, // not visible unless there is more than one action
              new go.Binding("visible", "actions", function (acts) {
                return Array.isArray(acts) && acts.length > 0;
              }),
              // headered by a label and a PanelExpanderButton inside a Table
              $(
                go.Panel,
                "Table",
                { stretch: go.GraphObject.Horizontal },
                $(go.TextBlock, "Choices", {
                  alignment: go.Spot.Left,
                  font: "10pt Verdana, sans-serif",
                }),
                $(
                  "PanelExpanderButton",
                  "COLLAPSIBLE", // name of the object to make visible or invisible
                  { column: 1, alignment: go.Spot.Right }
                )
              ), // end Table panel
              // with the list data bound in the Vertical Panel
              $(
                go.Panel,
                "Vertical",
                {
                  name: "COLLAPSIBLE", // identify to the PanelExpanderButton
                  padding: 2,
                  stretch: go.GraphObject.Horizontal, // take up whole available width
                  background: "white", // to distinguish from the node's body
                  defaultAlignment: go.Spot.Left, // thus no need to specify alignment on each element
                  itemTemplate: actionTemplate, // the Panel created for each item in Panel.itemArray
                },
                new go.Binding("itemArray", "actions") // bind Panel.itemArray to nodedata.actions
              ) // end action list Vertical Panel
            ) // end optional Vertical Panel
          ) // end outer Vertical Panel
        ), // end "BODY"  Auto Panel
        $(
          go.Panel, // this is underneath the "BODY"
          { height: 17 }, // always this height, even if the TreeExpanderButton is not visible
          $("TreeExpanderButton")
        )
      );

      // define a second kind of Node:
      myDiagram.nodeTemplateMap.add(
        "Terminal",
        $(
          go.Node,
          "Spot",
          $(go.Shape, "Circle", {
            width: 55,
            height: 55,
            fill: greengrad,
            stroke: null,
          }),
          $(
            go.TextBlock,
            { font: "10pt Verdana, sans-serif" },
            new go.Binding("text")
          )
        )
      );

      myDiagram.linkTemplate = $(
        go.Link,
        go.Link.Orthogonal,
        { deletable: false, corner: 10 },
        $(go.Shape, { strokeWidth: 2 }),
        $(
          go.TextBlock,
          go.Link.OrientUpright,
          {
            background: "white",
            visible: false, // unless the binding sets it to true for a non-empty string
            segmentIndex: -2,
            segmentOrientation: go.Link.None,
          },
          new go.Binding("text", "answer"),
          // hide empty string;
          // if the "answer" property is undefined, visible is false due to above default setting
          new go.Binding("visible", "answer", function (a) {
            return a ? true : false;
          })
        )
      );

      

      var nodeDataArray = [
        {
          key: 1,
          question: "Greeting", // 父节点
          // actions: [
          //   // 子节点
          //   {
          //     // text: "Sales",
          //     // figure: "ElectricalHazard",
          //     // fill: "blue",
          //   },
          //   {
          //     text: "Parts and Services",
          //     // figure: "FireHazard",
          //     // fill: "red",
          //   },
          //   {
          //     text: "Representative",
          //     // figure: "IrritationHazard",
          //     // fill: "yellow",
          //   },
          // ],
        },
        {
          key: 2,
          question: "Sales",
          actions: [
            // { text: "Compact", figure: "ElectricalHazard", fill: "blue" },
            // { text: "Mid-Size", figure: "FireHazard", fill: "red" },
            // { text: "Large", figure: "IrritationHazard", fill: "yellow" },
          ],
        },
        {
          key: 3,
          question: "Parts and Services",
          actions: [
            { text: "Maintenance", figure: "ElectricalHazard", fill: "blue" },
            { text: "Repairs", figure: "FireHazard", fill: "red" },
            {
              text: "State Inspection",
              figure: "IrritationHazard",
              fill: "yellow",
            },
          ],
        },
        { key: 4, question: "Representative" },
        { key: 5, question: "Compact" },
        { key: 6, question: "Mid-Size" },
        {
          key: 7,
          question: "Large",
          actions: [
            { text: "SUV", figure: "ElectricalHazard", fill: "blue" },
            { text: "Van", figure: "FireHazard", fill: "red" },
          ],
        },
        { key: 8, question: "Maintenance" },
        { key: 9, question: "Repairs" },
        { key: 10, question: "State Inspection" },
        { key: 11, question: "SUV" },
        { key: 12, question: "Van" },
        { key: 13, category: "Terminal", text: "Susan" },
        { key: 14, category: "Terminal", text: "Eric" },
        { key: 15, category: "Terminal", text: "Steven" },
        { key: 16, category: "Terminal", text: "Tom" },
        { key: 17, category: "Terminal", text: "Emily" },
        { key: 18, category: "Terminal", text: "Tony" },
        { key: 19, category: "Terminal", text: "Ken" },
        { key: 20, category: "Terminal", text: "Rachel" },
      ];
      var linkDataArray = [
        { from: 1, to: 2, answer: 1 },
        { from: 1, to: 3, answer: 2 },
        { from: 1, to: 4, answer: 3 },
        { from: 2, to: 5, answer: 1 },
        { from: 2, to: 6, answer: 2 },
        { from: 2, to: 7, answer: 3 },
        { from: 3, to: 8, answer: 1 },
        { from: 3, to: 9, answer: 2 },
        { from: 3, to: 10, answer: 3 },
        { from: 7, to: 11, answer: 1 },
        { from: 7, to: 12, answer: 2 },
        { from: 5, to: 13 },
        { from: 6, to: 14 },
        { from: 11, to: 15 },
        { from: 12, to: 16 },
        { from: 8, to: 17 },
        { from: 9, to: 18 },
        { from: 10, to: 19 },
        { from: 4, to: 20 },
      ];

      // create the Model with the above data, and assign to the Diagram
      myDiagram.model = $(go.GraphLinksModel, {
        copiesArrays: true,
        copiesArrayObjects: true,
        nodeDataArray: nodeDataArray,
        linkDataArray: linkDataArray,
      });
    }
    init();
    // window.addEventListener('DOMContentLoaded', init);
  }
  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  render() {
    return (
      <div>
        <LeftDrawer>
          <div className="menu">
            <div id="paletteZone">
              <div className="draggable" draggable="true">
                Water
              </div>
              <div className="draggable" draggable="true">
                Coffee
              </div>
              <div className="draggable" draggable="true">
                Tea
              </div>
            </div>
            <ul className="">
              <li
              // draggable="true"
              >
                <img
                  className="draggable"
                  textcontent="短信"
                  draggable="true"
                  src={sms}
                />
                <div>短信</div>
              </li>
              <li>
                <img
                  textcontent="模板信息"
                  draggable="true"
                  src={modeltplate}
                  draggable="true"
                />
                <div> 模板信息</div>
              </li>
              <li>
                <img textcontent="发券" draggable="true" src={quan} />
                <div> 发券</div>
              </li>
            </ul>
          </div>
        </LeftDrawer>
        <div className="diagram-box">
          <div
            id="myDiagramDiv"
            style={{
              border: "solid 1px blue",
              width: "1500px",
              height: "800px",
            }}
          ></div>
        </div>
      </div>
    );
  }
}

export default Index;
