import { Request, Response } from "express";
import { queues } from "../../../database";

export default async (req: Request, res: Response) => {
  let search = req.query.q;
  let status = req.query.open;
  let type = req.query.type;
  let mode = req.query.mode;
  let _sort = req.query.sort;
  const allQueues = await queues.find();

  let response: any[] = [];

  allQueues.forEach((q) => {
    response.push({
      _id: q._id,
      name: q.name,
      banner: q.banner,
      type: q.type,
      modes: q.modes,
      genres: q.genres,
      open: q.open,
      country: q.country,
      icon: q.icon,
      verified: q.verified,
    });
  });

  if (search) {
    search = search.toString().toLowerCase().trim();

    search.split(" ").forEach((arg) => {
      response = response.filter((r) => {
        return (
          r.genres.map((g) => g.toLowerCase()).includes(arg.toLowerCase()) ||
          (r.genres.map((g) => g.toLowerCase()).includes(arg.toLowerCase()) &&
            r.name.toLowerCase().includes(arg.toLowerCase())) ||
          r.name.toLowerCase().includes(arg.toLowerCase())
        );
      });
    });
  }

  if (mode) {
    let _mode = Number(mode.toString().toLowerCase().trim());

    if (!isNaN(_mode)) {
      response = response.filter((r) => r.modes.includes(_mode));
    }
  }

  if (status != undefined) {
    let _status: string | boolean = status.toString().toLowerCase().trim();

    if (status.toString().toLowerCase().trim() == "false") {
      _status = false;
    } else if (status.toString().toLowerCase().trim() == "true") {
      _status = true;
    }

    if (status.toString().toLowerCase().trim() != "any") {
      response = response.filter((r) => r.open == _status);
    }
  }

  if (type) {
    let _type = type.toString().toLowerCase().trim();

    if (_type != "any") {
      if (type == "nominator") {
        response = response.filter((r) => ["BN", "NAT"].includes(r.type));
      }
      if (type == "modder") {
        response = response.filter((r) => ["modder"].includes(r.type));
      }
      if (type == "group") {
        response = response.filter((r) => ["group"].includes(r.type));
      }
    }
  }

  if (_sort) {
    _sort = _sort.toString().toLowerCase().trim();

    switch (_sort) {
      case "ab": {
        response.sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
          }
          if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
          }

          return -1;
        });

        break;
      }
      case "ba": {
        response.sort((a, b) => {
          if (b.name.toLowerCase() < a.name.toLowerCase()) {
            return -1;
          }
          if (b.name.toLowerCase() > a.name.toLowerCase()) {
            return 1;
          }

          return -1;
        });

        break;
      }
      default: {
        response.sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
          }
          if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
          }

          return -1;
        });

        break;
      }
    }
  } else {
    response.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      }

      return -1;
    });
  }

  return res.status(200).send({
    status: 200,
    data: response,
  });
};
