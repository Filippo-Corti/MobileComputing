import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: appBar(),
      backgroundColor: Colors.white,
      body: Column(
        children: [
          searchBar(),
        ],
      ),
    );
  }

  AppBar appBar() {
    return AppBar(
      elevation: 0.0,
      toolbarHeight: 35,
      title: Image.asset(
        'assets/trenord.png',
        width: 180,
      ),
      centerTitle: true,
      backgroundColor: const Color(0xff0F6B39),
      actions: [
        Container(
          margin: const EdgeInsets.only(right: 15),
          child: SvgPicture.asset(
            'assets/bell.svg',
            width: 17,
            height: 17,
          ),
        )
      ],
    );
  }
}

Container searchBar() {
  return Container(
    padding: const EdgeInsets.only(left: 20, right: 20, bottom: 10, top: 55),
    decoration: const BoxDecoration(
      color: Color(0xff0F6B39),
    ),
    child: TextField(
      style: const TextStyle(color: Colors.white),
      obscureText: true,
      textAlign: TextAlign.center,
      decoration: InputDecoration(
        border: const UnderlineInputBorder(
          borderSide: BorderSide(
            color: Colors.white,
          ),
        ),
        enabledBorder: const UnderlineInputBorder(
          borderSide: BorderSide(
            color: Colors.white,
          ),
        ),
        focusedBorder: const UnderlineInputBorder(
          borderSide: BorderSide(
            color: Colors.white,
          ),
        ),
        labelStyle: const TextStyle(
          color: Colors.white,
        ),
        label: Center(
          child: Row(mainAxisSize: MainAxisSize.min, children: [
            SizedBox(
              width: 24,
              height: 24,
              child: SvgPicture.asset(
                'assets/path.svg',
                color: Colors.white,
              ),
            ),
            const SizedBox(width: 5), // give it width
            const Text('Cerca un nuovo viaggio'),
          ]),
        ),
        alignLabelWithHint: true,
      ),
    ),
  );
}
