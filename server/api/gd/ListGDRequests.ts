import { Request, Response } from "express";
import { gds, queues, requests, users } from "../../../database";

export default async (req: Request, res: Response) => {
  const listing = await gds.find();
  let type = req.query.category;

  if (!type) type = "all"; // ? Fallback to all if no category provided
  type = type.toString(); // ? Stringify if another data type is provided

  if (type == "new") {
    listing.sort(
      (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf()
    );

    const recent = listing;

    recent.splice(4, 99999);

    return res.status(200).send({
      status: 200,
      data: recent,
    });
  }

  if (type != "all") {
    listing.sort(
      (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf()
    );

    const response = listing.filter((d) => {
      let pass = false;

      if (!type) type = "all"; // ? Fallback to all if no category provided

      type = type.toString(); // ? moyai

      for (const genre of d.genres) {
        if (genre.toLowerCase().trim().includes(type.toLowerCase()))
          pass = true;
      }

      return pass;
    });

    return res.status(200).send({
      status: 200,
      data: response,
    });
  }

  res.status(200).send({
    status: 200,
    data: listing,
  });
};
